import { _decorator, Asset, resources } from 'cc';
import { EventMgr } from '../utils/EventMgr';

export enum LoadDataType {
    DIR,
    FILE
}

export class LoadData {
    path: string = "";
    loadType: LoadDataType = LoadDataType.FILE;
    fileType: typeof Asset = Asset; 

    constructor(path: string = "", loadType: LoadDataType = LoadDataType.FILE, fileType: typeof Asset = Asset) {
        this.path = path;
        this.loadType = loadType;
        this.fileType = fileType;
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
        if (data.loadType == LoadDataType.DIR) {
            //加载目录
            resources.loadDir(data.path, data.fileType, 
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
            resources.load(data.path, data.fileType, 
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
        let percent: number = 1 / this._loadDataList.length;
        let subPercent:number = (finish / total) * percent;
        let totalPercent:number = Number((subPercent + percent * this._curIndex).toFixed(2));
        if (this._target && this._progressCallback) {
            this._progressCallback.call(this._target, totalPercent);
        }
        EventMgr.emit("load_progress", totalPercent);
    }

    protected onComplete(error: Error = null): void {
        if (this._target && this._completeCallback) {
            this._completeCallback.call(this._target, error, this._completePaths, this._completeAssets);
        }
        EventMgr.emit("load_complete");
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
