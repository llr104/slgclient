export enum LoadDataType {
    DIR,
    FILE
}

export class LoadData {
    path: string = "";
    type: LoadDataType = LoadDataType.FILE;
}

export class LoadCompleteData {
    path:string = "";
    data:any;
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
    protected _progressCallback:Function = null;
    protected _completeCallback: Function = null;
    protected _target: any = null;

    constructor() {

    }

    public onDestory(): void {
        this._loadDataList.length = 0;
    }

    protected loadNext():void {
        if (this._curIndex >= this._loadDataList.length) {
            this.onComplete();
        }
    }

    protected onProgress():void {
        
    }

    protected onComplete():void {
        if (this._target && this._completeCallback) {
            this._completeCallback.call(this._target, this._completePaths, this._completeAssets);
        }
    }

    public startLoad(data: LoadData, loadProgress: Function = null, loadComplete: Function = null, target: any = null): void {
        this.startLoadList([data], loadProgress, loadComplete);
    }

    public startLoadList(dataList: LoadData[], loadProgress: Function = null, loadComplete: Function = null, target: any = null): void {
        if (this._isLoading) {
            return;
        }
        this._isLoading = true;
        this._progressCallback = loadProgress;
        this._completeCallback = loadComplete;
        this._target = target;
        this._curIndex = 0;
        this.loadNext();
        
    }
}