import { NetManager } from "../network/socket/NetManager";
import { ServerConfig } from "../config/ServerConfig";
import { MapCityData } from "../map/MapCityProxy";
import MapCommand from "../map/MapCommand";
import ChatProxy from "./ChatProxy";

export default class ChatCommand {
    //单例
    protected static _instance: ChatCommand;
    public static getInstance(): ChatCommand {
        if (this._instance == null) {
            this._instance = new ChatCommand();
        }
        return this._instance;
    }


    //数据model
    protected _proxy:ChatProxy = new ChatProxy();

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

    public get proxy(): ChatProxy {
        return this._proxy;
    }


    public appoint(rid:number = 0):void{
        let sendData: any = {
            name: ServerConfig.union_kick,
            msg: {
                rid:rid,
            }
        };
        NetManager.getInstance().send(sendData);
    }

    
}