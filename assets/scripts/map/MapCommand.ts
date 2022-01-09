import { _decorator } from 'cc';
import { ServerConfig } from "../config/ServerConfig";
import ArmyCommand from "../general/ArmyCommand";
import GeneralCommand from "../general/GeneralCommand";
import { NetManager } from "../network/socket/NetManager";
import DateUtil from "../utils/DateUtil";
import MapBuildProxy, { MapBuildData } from "./MapBuildProxy";
import MapCityProxy, { MapCityData } from "./MapCityProxy";
import MapProxy, { MapAreaData } from "./MapProxy";
import MapUtil from "./MapUtil";
import MapUICommand from "./ui/MapUICommand";
import { EventMgr } from '../utils/EventMgr';

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
        EventMgr.on(ServerConfig.role_myProperty, this.onRoleMyProperty, this);
        EventMgr.on(ServerConfig.roleBuild_push, this.onRoleBuildStatePush, this);
        EventMgr.on(ServerConfig.nationMap_config, this.onNationMapConfig, this);
        EventMgr.on(ServerConfig.nationMap_scanBlock, this.onNationMapScanBlock, this);
        EventMgr.on(ServerConfig.nationMap_giveUp, this.onNationMapGiveUp, this);
        EventMgr.on(ServerConfig.nationMap_build, this.onNationMapBuild, this);
        EventMgr.on(ServerConfig.nationMap_upBuild, this.onNationMapUpBuild, this);
        EventMgr.on(ServerConfig.roleCity_push, this.onRoleCityPush, this);
        EventMgr.on(ServerConfig.role_posTagList, this.onPosTagList, this);
        EventMgr.on(ServerConfig.role_opPosTag, this.onOpPosTag, this);
    }

    public onDestory(): void {
        EventMgr.targetOff(this);
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
            this._cityProxy.myParentId = this._cityProxy.getMyMainCity().parentId;
            this._buildProxy.myUnionId = this._cityProxy.getMyMainCity().unionId;
            this._buildProxy.myParentId = this._cityProxy.getMyMainCity().parentId;
            MapCommand.getInstance().posTagList();
            
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
    }

    protected onNationMapBuild(data: any, otherData: any): void {
        console.log("onNationMapBuild", data, otherData);
    }

    protected onNationMapUpBuild(data: any, otherData: any): void {
        console.log("onNationMapUpBuild", data, otherData);
    }

    protected onPosTagList(data: any, otherData: any): void {
        console.log("onPosTagList", data, otherData);
        if(data.code == 0){
            this._proxy.updateMapPosTags(data.msg.pos_tags);
        }
    }

    protected onOpPosTag(data: any, otherData: any): void {
        console.log("onOpPosTag", data, otherData);
        if(data.code == 0){
            if(data.msg.type == 0){
                this._proxy.removeMapPosTag(data.msg.x, data.msg.y);
                // EventMgr.emit("show_toast", "移除成功");
                EventMgr.emit("update_tag");
            }else if(data.msg.type == 1){
                this._proxy.addMapPosTag(data.msg.x, data.msg.y, data.msg.name);
                // EventMgr.emit("show_toast", "添加成功");
                EventMgr.emit("update_tag");
            }
        }
    }
    

    protected onRoleCityPush(data: any): void {
        console.log("onRoleCityPush:", data)
        this._buildProxy.updateSub(data.msg.rid, data.msg.union_id, data.msg.parent_id);
        this._cityProxy.updateCity(data.msg);
        EventMgr.emit("unionChange", data.msg.rid, data.msg.union_id, data.msg.parent_id);
       
    }

    public isBuildSub(id: number): boolean {
        let buiildData: MapBuildData = this.buildProxy.getBuild(id);
        if (buiildData) {
            if (buiildData.rid == this.buildProxy.myId){
                return true;
            }

            if (buiildData.unionId > 0 && buiildData.unionId == this.buildProxy.myUnionId){
                return true
            }

            if (buiildData.parentId > 0 && buiildData.parentId == this.buildProxy.myUnionId){
                return true
            }
        }
        return false
    }

    public isBuildWarFree(id: number): boolean {
        let buiildData: MapBuildData = this.buildProxy.getBuild(id);
        if(buiildData){
            return buiildData.isWarFree();
        }else{
            return false;
        }
    }

    
    public isCitySub(id: number): boolean {
        let cityData: MapCityData = this.cityProxy.getCity(id);
        if (cityData) {
            if (cityData.rid == this.cityProxy.myId){
                return true
            }

            if (cityData.unionId > 0 && cityData.unionId == this.cityProxy.myUnionId){
                return true
            }

            if (cityData.parentId > 0 && cityData.parentId == this.cityProxy.myUnionId){
                return true
            }
        }
        return false
    }

    public isCityWarFree(id: number): boolean {
        let cityData: MapCityData = this.cityProxy.getCity(id);
        if (cityData && cityData.parentId > 0) {
            var diff = DateUtil.getServerTime() - cityData.occupyTime;
            if(diff < MapCommand.getInstance().proxy.getWarFree()){
                return true;
            }
        }
        return false
    }


    /**是否是可行军的位置*/
    public isCanMoveCell(x: number, y: number): boolean {
        let id: number = MapUtil.getIdByCellPoint(x, y);
        if (this.isBuildSub(id)){
            return true
        }

        if (this.isCitySub(id)){
            return true
        }

        return false
    }

    public isCanOccupyCell(x: number, y: number): boolean {
        var radius = 0;
        let id: number = MapUtil.getIdByCellPoint(x, y);
        let cityData: MapCityData = this.cityProxy.getCity(id);
        if (cityData) {
            if(this.isCityWarFree(id)){
                return false;
            }
            radius = cityData.getCellRadius();
        }

        let buildData: MapBuildData = this.buildProxy.getBuild(id);
        if (buildData) {
            if(this.isBuildWarFree(id)){
                return false;
            }

            // console.log("buildData 11111:", buildData);
            radius = buildData.getCellRadius();
        }

        //查找半径10
        for (let tx = x-10; tx <= x+10; tx++) {
            for (let ty = y-10; ty <= y+10; ty++) {

                let id: number = MapUtil.getIdByCellPoint(tx, ty);
                let cityData: MapCityData = this.cityProxy.getCity(id);
                if (cityData) {
                    var absX = Math.abs(x-tx);
                    var absY = Math.abs(y-ty);
                    if (absX <= radius+cityData.getCellRadius()+1 && absY <= radius+cityData.getCellRadius()+1){
                        var ok = this.isCitySub(id)
                        if(ok){
                            return true;
                        }
                    }
                }
        
                let buildData: MapBuildData = this.buildProxy.getBuild(id);
                if (buildData) {
                    var absX = Math.abs(x-tx);
                    var absY = Math.abs(y-ty);
                    // console.log("MapBuildData:", absX, absY, radius+buildData.getCellRadius()+1, buildData);
                    if (absX <= radius+buildData.getCellRadius()+1 && absY <= radius+buildData.getCellRadius()+1){
                        var ok = this.isBuildSub(id)
                        if(ok){
                            return true;
                        }
                    }
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
        EventMgr.emit("enter_map");
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

    public build(x: number, y: number, type: number): void {
        let sendData: any = {
            name: ServerConfig.nationMap_build,
            msg: {
                x: x,
                y: y,
                type: type,
            }
        };
        NetManager.getInstance().send(sendData);
    }

    public upBuild(x: number, y: number): void {
        let sendData: any = {
            name: ServerConfig.nationMap_upBuild,
            msg: {
                x: x,
                y: y,
            }
        };
        NetManager.getInstance().send(sendData);
    }

    public delBuild(x: number, y: number): void {
        let sendData: any = {
            name: ServerConfig.nationMap_delBuild,
            msg: {
                x: x,
                y: y,
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

    public posTagList(): void {
        let sendData: any = {
            name: ServerConfig.role_posTagList,
            msg: {
            }
        };
        NetManager.getInstance().send(sendData);
    }

    //1添加、0移除
    public opPosTag(type:number, x: number, y: number, name = ""): void {
        let sendData: any = {
            name: ServerConfig.role_opPosTag,
            msg: {
                type:type,
                x:x,
                y:y,
                name:name,
            }
        };
        NetManager.getInstance().send(sendData);
    }

}
