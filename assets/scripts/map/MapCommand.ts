import { ServerConfig } from "../config/ServerConfig";
import { NetManager } from "../network/socket/NetManager";
import MapUICommand from "./ui/MapUICommand";
import MapProxy, { MapAreaData } from "./MapProxy";


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
        cc.systemEvent.on(ServerConfig.role_myCity, this.onRoleMyCity, this);
        cc.systemEvent.on(ServerConfig.nationMap_config, this.onNationMapConfig, this);
        cc.systemEvent.on(ServerConfig.nationMap_scanBlock, this.onNationMapScanBlock, this);
    }

    public onDestory(): void {
        cc.systemEvent.targetOff(this);
    }

    public get proxy(): MapProxy {
        return this._proxy;
    }

    protected onRoleMyCity(data: any): void {
        console.log("onRoleMyCity", data);
        if (data.code == 0) {
            this._proxy.setMyCitys(data.msg.citys);
            this.enterMap();
        }
    }

    protected onNationMapConfig(data: any): void {
        console.log("onNationMapConfig", data);
        if (data.code == 0) {
            this._proxy.setNationMapConfig(data.msg.Confs);
            this.enterMap();
        }
    }

    protected onNationMapScanBlock(data: any, otherData: any): void {
        console.log("onNationMapScan", data, otherData);
        if (data.code == 0) {
            this._proxy.setMapScanBlock(data.msg, otherData.id);
        }
    }

    protected initMapResConfig(serverId: number = 0): void {
        // cc.resources.load(["./world/worldMap", "./config/mapRes_" + serverId], this.loadMapResComplete.bind(this));
        // MapUICommand.getInstance().initMapJsonConfig();
    }

    protected loadMapResComplete(error: Error, assets: any[]): void {
        if (error == undefined) {
            this._proxy.tiledMapAsset = assets[0] as cc.TiledMapAsset;
            this._proxy.initMapResConfig((assets[1] as cc.JsonAsset).json);
            this.enterMap();
        } else {
            console.log("loadMapResComplete error ", error);
        }
    }

    public enterMap(): void {
        if (this._proxy.hasResConfig() == false) {
            this.qryNationMapConfig();
            return;
        }
        if (this._proxy.getMyMainCity() == null) {
            this.qryRoleMyCity();
            return;
        }
        cc.systemEvent.emit("enter_map");
    }

    /**请求自己的城池信息*/
    public qryRoleMyCity(): void {
        let sendData: any = {
            name: ServerConfig.role_myCity,
            msg: {}
        };
        NetManager.getInstance().send(sendData);
    }

    /**请求地图基础配置*/
    public qryNationMapConfig(): void {
        let sendData: any = {
            name: ServerConfig.nationMap_config,
            msg: {}
        };
        NetManager.getInstance().send(sendData);
    }

    public qryNationMapScanBlock(qryData: MapAreaData): void {
        let sendData: any = {
            name: ServerConfig.nationMap_scanBlock,
            msg: {
                x: qryData.startCellX,
                y: qryData.startCellY,
                length: qryData.len
            }
        };
        NetManager.getInstance().send(sendData, qryData);
    }
}