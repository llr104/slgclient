import { ServerConfig } from "../config/ServerConfig";
import { NetManager } from "../network/socket/NetManager";
import MapProxy from "./MapProxy";

export default class MapCommand {
    //单例
    protected static _instance: MapCommand;
    public static getInstance(): MapCommand {
        if (this._instance == null) {
            this._instance = new MapCommand();
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
    protected _proxy: MapProxy = new MapProxy();

    constructor() {
        cc.systemEvent.on(ServerConfig.nationMap_config, this.onNationMapConfig, this);
        cc.systemEvent.on(ServerConfig.nationMap_scan, this.onNationMapScan, this);
    }

    public onDestory(): void {
        cc.systemEvent.targetOff(this);
    }

    protected onNationMapConfig(data: any): void {
        console.log("onNationMapConfig", data);
        if (data.code == 0) {
            this._proxy.setNationMapConfig(data.msg.Confs);
            this.qryNationMapScan(19, 19);
            this.enterMap();
        }
    }

    protected onNationMapScan(data: any): void {
        console.log("onNationMapScan", data);
    }

    public enterMap():void {
        if (this._proxy.getConfig() == null) {
            this.qryNationMapConfig();
            return;
        }
        cc.systemEvent.emit("enter_map");
    }

    /**请求地图基础配置*/
    public qryNationMapConfig(): void {
        let send_data: any = {
            name: ServerConfig.nationMap_config,
            msg: {}
        };
        NetManager.getInstance().send(send_data);
    }

    public qryNationMapScan(x: number, y: number): void {
        let send_data: any = {
            name: ServerConfig.nationMap_scan,
            msg: {
                x: x,
                y: y
            }
        };
        NetManager.getInstance().send(send_data);
    }
}