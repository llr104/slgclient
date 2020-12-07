import UnionProxy from "./UnionProxy";

export default class UnionCommand {
    //单例
    protected static _instance: UnionCommand;
    public static getInstance(): UnionCommand {
        if (this._instance == null) {
            this._instance = new UnionCommand();
        }
        return this._instance;
    }


    //数据model
    protected _proxy: UnionProxy = new UnionProxy();

    public static destory(): boolean {
        if (this._instance) {
            this._instance.onDestory();
            this._instance = null;
            return true;
        }
        return false;
    }

    //数据model

    constructor() {
    }

    public onDestory(): void {
        cc.systemEvent.targetOff(this);
    }

    public clearData(): void {
        this._proxy.clearData();
    }

    public get proxy(): UnionProxy {
        return this._proxy;
    }
}