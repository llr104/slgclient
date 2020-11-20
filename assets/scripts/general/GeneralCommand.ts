import { ServerConfig } from "../config/ServerConfig";
import { NetManager } from "../network/socket/NetManager";
import GeneralProxy from "./GeneralProxy";

export default class GeneralCommand {
    //单例
    protected static _instance: GeneralCommand;
    public static getInstance(): GeneralCommand {
        if (this._instance == null) {
            this._instance = new GeneralCommand();
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

    //数据model
    protected _proxy: GeneralProxy = new GeneralProxy();

    constructor() {
        cc.systemEvent.on(ServerConfig.general_myGenerals, this.onMyGenerals, this);
    }

    public onDestory(): void {
        cc.systemEvent.targetOff(this);
    }

    public get proxy(): GeneralProxy {
        return this._proxy;
    }

    /**我的将领列表*/
    protected onMyGenerals(data:any): void {
        console.log("onMyGeneralsonMyGenerals ", data);
        if(data.code == 0){
            this._proxy.updateMyGenerals(data.msg.generals);
            cc.systemEvent.emit("update_my_generals");
        }
    }

    public qryMyGenerals(): void {
        let sendData: any = {
            name: ServerConfig.general_myGenerals,
            msg: {
            }
        };
        NetManager.getInstance().send(sendData);
    }
}