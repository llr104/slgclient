import { ServerConfig } from "../config/ServerConfig";
import ArmyCommand from "../general/ArmyCommand";
import GeneralCommand from "../general/GeneralCommand";
import { NetManager } from "../network/socket/NetManager";
import MapBuildProxy, { MapBuildData } from "./MapBuildProxy";
import MapCityProxy, { MapCityData } from "./MapCityProxy";
import MapProxy, { MapAreaData } from "./MapProxy";
import MapUtil from "./MapUtil";
import MapUICommand from "./ui/MapUICommand";


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
    protected _cityProxy: MapCityProxy = new MapCityProxy();
    protected _buildProxy: MapBuildProxy = new MapBuildProxy();
    protected _isQryMyProperty: boolean = false;

    constructor() {
        cc.systemEvent.on(ServerConfig.role_myProperty, this.onRoleMyProperty, this);
        cc.systemEvent.on(ServerConfig.roleBuild_push, this.onRoleBuildStatePush, this);
        cc.systemEvent.on(ServerConfig.nationMap_config, this.onNationMapConfig, this);
        cc.systemEvent.on(ServerConfig.nationMap_scanBlock, this.onNationMapScanBlock, this);
        cc.systemEvent.on(ServerConfig.nationMap_giveUp, this.onNationMapGiveUp, this);
        cc.systemEvent.on(ServerConfig.city_upCity, this.onCityUpCity, this);
        cc.systemEvent.on(ServerConfig.roleCity_push, this.onRoleCityPush, this);
    }

    public onDestory(): void {
        cc.systemEvent.targetOff(this);
    }

    public initData(): void {
        this._proxy.initData();
        this._cityProxy.initData();
        this._buildProxy.initData();
    }

    public clearData(): void {
        this._proxy.clearData();
        this._cityProxy.clearData();
        this._buildProxy.clearData();
        this._isQryMyProperty = false;
    }

    public get proxy(): MapProxy {
        return this._proxy;
    }

    public get cityProxy(): MapCityProxy {
        return this._cityProxy;
    }

    public get buildProxy(): MapBuildProxy {
        return this._buildProxy;
    }

    protected onRoleMyProperty(data: any): void {
        console.log("onRoleMyProperty", data);
        if (data.code == 0) {
            this._isQryMyProperty = true;
            MapUICommand.getInstance().updateMyProperty(data);
            GeneralCommand.getInstance().updateMyProperty(data.msg.generals);
            ArmyCommand.getInstance().updateMyProperty(data.msg.armys);
            this._cityProxy.initMyCitys(data.msg.citys);
            this._buildProxy.initMyBuilds(data.msg.mr_builds);
            this._cityProxy.myId = this._cityProxy.getMyPlayerId();
            this._buildProxy.myId = this._cityProxy.getMyPlayerId();
            this._cityProxy.myUnionId = this._cityProxy.getMyMainCity().unionId;
            this._buildProxy.myUnionId = this._cityProxy.getMyMainCity().unionId;
            this.enterMap();
        }
    }

    protected onRoleBuildStatePush(data: any): void {
        console.log("onRoleBuildStatePush", data);
        if (data.code == 0) {
            this._buildProxy.updateBuild(data.msg);
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
            this._cityProxy.setMapScanBlock(data.msg, otherData.id);
            this._buildProxy.setMapScanBlock(data.msg, otherData.id);
        }
    }

    protected onNationMapGiveUp(data: any, otherData: any): void {
        console.log("onNationMapGiveUp", data, otherData);
        if (data.code == 0) {
            this._buildProxy.removeBuild(data.msg.x, data.msg.y);
        }
    }

    protected onCityUpCity(data: any): void {
        if (data.code == 0) {
            let cityData: MapCityData = this._cityProxy.updateCity(data.msg.city);
            cc.systemEvent.emit("update_city", cityData)
        }
    }

    protected onRoleCityPush(data: any): void {
        console.log("onRoleCityPush", data);
        let cityData: MapCityData = this._cityProxy.updateCity(data.msg);
        if (cityData.cityId == this._cityProxy.getMyMainCity().cityId) {
            this._cityProxy.myUnionId = this._buildProxy.myUnionId = cityData.unionId;
            console.log("my_union_change", this._cityProxy.myUnionId);
            cc.systemEvent.emit("my_union_change", this._cityProxy.myUnionId);
        }
        cc.systemEvent.emit("update_city", cityData);
    }

    /**是否是可行军的位置*/
    public isCanMoveCell(x: number, y: number): boolean {
        let id: number = MapUtil.getIdByCellPoint(x, y);
        let buiildData: MapBuildData = this.buildProxy.getBuild(id);
        if (buiildData
            && (buiildData.rid == this.buildProxy.myId
                || (buiildData.unionId > 0
                    && buiildData.unionId == this.buildProxy.myUnionId))) {
            return true;
        }
        let cityData: MapCityData = this.cityProxy.getCity(id);
        if (cityData && (cityData.rid == this.cityProxy.myId
            || (cityData.unionId > 0
                && cityData.unionId == this.cityProxy.myUnionId))) {
            return true;
        }
    }

    public isCanOccupyCell(x: number, y: number): boolean {
        let id: number = MapUtil.getIdByCellPoint(x, y);
        let buiildData: MapBuildData = this.buildProxy.getBuild(id);
        if (buiildData
            && (buiildData.rid == this.buildProxy.myId
                || (buiildData.unionId > 0
                    && buiildData.unionId == this.buildProxy.myUnionId))) {
            return false;//已经占领
        }
        let cityData: MapCityData = this.cityProxy.getCity(id);
        if (cityData && (cityData.rid == this.cityProxy.myId
            || (cityData.unionId > 0
                && cityData.unionId == this.cityProxy.myUnionId))) {
            return false;//已经建城
        }
        let ids: number[] = MapUtil.get9GridCellIds(id);
        for (let i: number = 0; i < ids[i]; i++) {
            if (ids[i] != id) {
                buiildData = this.buildProxy.getBuild(ids[i]);
                if (buiildData
                    && (buiildData.rid == this.buildProxy.myId
                        || (buiildData.unionId > 0
                            && buiildData.unionId == this.buildProxy.myUnionId))) {
                    return true;//已经占领相邻格子
                }
                cityData = this.cityProxy.getCity(ids[i]);
                if (cityData && (cityData.rid == this.cityProxy.myId
                    || (cityData.unionId > 0
                        && cityData.unionId == this.cityProxy.myUnionId))) {
                    return true;//已经在相邻格子建城
                }
            }
        }
        return false;
    }

    public enterMap(): void {
        if (this._proxy.hasResConfig() == false) {
            this.qryNationMapConfig();
            return;
        }
        if (this._isQryMyProperty == false) {
            this.qryRoleMyProperty();
            return;
        }
        cc.systemEvent.emit("enter_map");
    }

    /**请求角色全量信息*/
    public qryRoleMyProperty(): void {
        let sendData: any = {
            name: ServerConfig.role_myProperty,
            msg: {
            }
        };
        NetManager.getInstance().send(sendData);
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

    public giveUpBuild(x: number, y: number): void {
        let sendData: any = {
            name: ServerConfig.nationMap_giveUp,
            msg: {
                x: x,
                y: y
            }
        };
        NetManager.getInstance().send(sendData);
    }

    public upPosition(x: number, y: number): void {
        let sendData: any = {
            name: ServerConfig.role_upPosition,
            msg: {
                x: x,
                y: y
            }
        };
        NetManager.getInstance().send(sendData);
    }
}