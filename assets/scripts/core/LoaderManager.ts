export enum LoadDataType {
    DIR,
    FILE
}

export class LoadData {
    path: string = "";
    type: LoadDataType = LoadDataType.FILE;

    constructor(path: string = "", type: LoadDataType = LoadDataType.FILE) {
        this.path = path;
        this.type = type;
    }
}

export class LoadCompleteData {
    path: string = "";
    data: any;
}

export default class LoaderManager {
    //单例
    protected static _instance: LoaderManager;
    public static getInstance(): LoaderManager {
        if (this._instance == null) {
            this._instance = new LoaderManager();
        }
        return this._instance;
    }

    public static destory(): boolean {
        if (this._instance) {
            this._instance.onDestory();
            this._instance = null;
            return true;
        }
        return false;
    }

    protected _isLoading: boolean = false;
    protected _curIndex: number = -1;
    protected _loadDataList: LoadData[] = [];
    protected _completePaths: string[] = [];
    protected _completeAssets: any[] = [];
    protected _progressCallback: Function = null;
    protected _completeCallback: Function = null;
    protected _target: any = null;

    constructor() {

    }

    public onDestory(): void {
        this._loadDataList.length = 0;
    }

    protected loadNext(): void {
        if (this._curIndex >= this._loadDataList.length) {
            this.onComplete();
            return;
        }
        let data: LoadData = this._loadDataList[this._curIndex];
        if (data.type == LoadDataType.DIR) {
            //加载目录
            cc.resources.loadDir(data.path,
                (finish: number, total: number) => {
                    this.onProgress(finish, total);
                },
                (error: Error, assets: any[]) => {
                    if (error == null) {
                        this._completePaths.push(data.path);
                        this._completeAssets.push(assets);
                        this._curIndex++;
                        this.loadNext();
                    } else {
                        this.onComplete(error);
                    }
                });
        } else {
            //加载文件
            cc.resources.load(data.path,
                (finish: number, total: number) => {
                    this.onProgress(finish, total);
                },
                (error: Error, asset: any) => {
                    if (error == null) {
                        this._completePaths.push(data.path);
                        this._completeAssets.push(asset);
                        this._curIndex++;
                        this.loadNext();
                    } else {
                        this.onComplete(error);
                    }
                });
        }
    }

    protected onProgress(finish: number, total: number): void {
        let percent: number = (this._curIndex + 1) / this._loadDataList.length;
        percent *= (finish / total);
        if (this._target && this._progressCallback) {
            this._progressCallback.call(this._target, percent);
        }
        cc.systemEvent.emit("load_progress", percent);
    }

    protected onComplete(error: Error = null): void {
        if (this._target && this._completeCallback) {
            this._completeCallback.call(this._target, error, this._completePaths, this._completeAssets);
        }
        cc.systemEvent.emit("load_complete");
        this.clearData();
    }

    protected clearData(): void {
        this._isLoading = false;
        this._loadDataList.length = 0;
        this._progressCallback = null;
        this._completeCallback = null;
        this._target = null;
        this._completeAssets.length = 0;
        this._completePaths.length = 0;
    }

    public startLoad(data: LoadData, loadProgress: (percent: number) => void, loadComplete: (error:Error, paths:string[], datas: any[]) => void, target: any = null): void {
        this.startLoadList([data], loadProgress, loadComplete);
    }

    public startLoadList(dataList: LoadData[], loadProgress: (percent: number) => void, loadComplete: (error:Error, paths:string[], datas: any[]) => void, target: any = null): void {
        if (this._isLoading) {
            return;
        }
        this.clearData();
        this._isLoading = true;
        this._loadDataList = dataList;
        this._progressCallback = loadProgress;
        this._completeCallback = loadComplete;
        this._target = target;
        this._curIndex = 0;
        this.loadNext();
    }
}