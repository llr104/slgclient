import { _decorator, Component, Node, Vec2, TiledMap } from 'cc';
const { ccclass, property } = _decorator;

import MapResBuildLogic from "../map/MapResBuildLogic";
import MapBuildTipsLogic from "../map/MapBuildTipsLogic";
import MapCityLogic from "../map/MapCityLogic";
import { MapCityData } from "../map/MapCityProxy";
import MapCommand from "../map/MapCommand";
import MapLogic from "../map/MapLogic";
import { MapAreaData, MapResType } from "../map/MapProxy";
import MapResLogic from "../map/MapResLogic";
import MapUtil from "../map/MapUtil";
import MapFacilityBuildLogic from "../map/MapFacilityBuildLogic";
import MapBuildTagLogic from "../map/MapBuildTagLogic";
import MapSysCityLogic from "../map/MapSysCityLogic";
import { EventMgr } from '../utils/EventMgr';

@ccclass('MapScene')
export default class MapScene extends Component {
    @property(Node)
    mapLayer: Node = null;

    protected _cmd: MapCommand = null;
    protected _centerX: number = 0;
    protected _centerY: number = 0;
    protected _lastUpPosTime: number = 0;

    protected onLoad(): void {
        this._cmd = MapCommand.getInstance();
        

        //初始化地图
        let tiledMap: TiledMap = this.mapLayer.addComponent(TiledMap);
        tiledMap.tmxAsset = this._cmd.proxy.tiledMapAsset;
        
        MapUtil.initMapConfig(tiledMap);
        this._cmd.initData();
        EventMgr.on("map_show_area_change", this.onMapShowAreaChange, this);
        EventMgr.on("scroll_to_map", this.onScrollToMap, this);
        this.scheduleOnce(() => {
            let myCity: MapCityData = this._cmd.cityProxy.getMyMainCity();
            this.node.getComponent(MapLogic).setTiledMap(tiledMap);
            this.node.getComponent(MapLogic).scrollToMapPoint(new Vec2(myCity.x, myCity.y));
            this.onTimer();//立即执行一次
        });
        this.schedule(this.onTimer, 0.2);
    }

    protected onDestroy(): void {
        EventMgr.targetOff(this);
        this._cmd.proxy.clearData();
        this._cmd = null;
    }

    protected onTimer(): void {

        if (this._cmd.proxy.qryAreaIds && this._cmd.proxy.qryAreaIds.length > 0) {
            let qryIndex: number = this._cmd.proxy.qryAreaIds.shift();
            let qryData: MapAreaData = this._cmd.proxy.getMapAreaData(qryIndex);
            if (qryData.checkAndUpdateQryTime()) {
                this._cmd.qryNationMapScanBlock(qryData);
            }
        }
        let nowTime: number = Date.now();
        if (nowTime - this._lastUpPosTime > 1000) {
            this._lastUpPosTime = nowTime;
            //间隔一秒检测中心点是否改变
            let point: Vec2 = MapCommand.getInstance().proxy.getCurCenterPoint();
            if (point != null && (this._centerX != point.x || this._centerY != point.y)) {
                this._centerX = point.x;
                this._centerY = point.y;
                MapCommand.getInstance().upPosition(point.x, point.y);
            }
        }
    }

    protected onMapShowAreaChange(centerPoint: Vec2, centerAreaId: number, addIds: number[], removeIds: number[]): void {
        
        console.log("map_show_area_change", arguments);
        let resLogic: MapResLogic = this.node.getComponent(MapResLogic);
        let buildResLogic: MapResBuildLogic = this.node.getComponent(MapResBuildLogic);
        let buildFacilityLogic: MapFacilityBuildLogic = this.node.getComponent(MapFacilityBuildLogic);
        let tagLogic: MapBuildTagLogic = this.node.getComponent(MapBuildTagLogic);
        let buildTipsLogic: MapBuildTipsLogic = this.node.getComponent(MapBuildTipsLogic);
        let cityLogic: MapCityLogic = this.node.getComponent(MapCityLogic);
        let sysCityLogic: MapSysCityLogic = this.node.getComponent(MapSysCityLogic);

        //更新展示区域
        resLogic.udpateShowAreas(addIds, removeIds);
        buildResLogic.udpateShowAreas(addIds, removeIds);
        buildFacilityLogic.udpateShowAreas(addIds, removeIds);
        tagLogic.udpateShowAreas(addIds, removeIds);
        buildTipsLogic.udpateShowAreas(addIds, removeIds);
        cityLogic.udpateShowAreas(addIds, removeIds);
        sysCityLogic.udpateShowAreas(addIds, removeIds);

        //更新区域内的具体节点
        for (let i: number = 0; i < addIds.length; i++) {
            let areaData: MapAreaData = this._cmd.proxy.getMapAreaData(addIds[i]);
            // console.log("areaData", areaData);
            for (let x: number = areaData.startCellX; x < areaData.endCellX; x++) {
                for (let y: number = areaData.startCellY; y < areaData.endCellY; y++) {
                    let cellId: number = MapUtil.getIdByCellPoint(x, y);
                    //资源
                    if (this._cmd.proxy.getResData(cellId)) {
                        resLogic.addItem(addIds[i], this._cmd.proxy.getResData(cellId));
                    }

                    if (this._cmd.proxy.getResData(cellId).type == MapResType.SYS_CITY) {
                        sysCityLogic.addItem(addIds[i], this._cmd.proxy.getResData(cellId));
                    }

                    //建筑
                    if (this._cmd.buildProxy.getBuild(cellId) != null) {
                        var build = this._cmd.buildProxy.getBuild(cellId);
                        if(build.type == MapResType.SYS_CITY){
                            //系统城池
                            sysCityLogic.addItem(addIds[i], build);
                        }else if(build.type == MapResType.SYS_FORTRESS){
                            console.log("MapResType.SYS_FORTRESS");
                            resLogic.addItem(addIds[i], build);
                        } else{
                            buildResLogic.addItem(addIds[i], build);
                        }
                    }

                    if (this._cmd.buildProxy.getBuild(cellId) != null) {
                        buildFacilityLogic.addItem(addIds[i], this._cmd.buildProxy.getBuild(cellId));
                    }

                    //标记
                    if (this._cmd.proxy.getResData(cellId).type <= MapResType.FORTRESS) {
            
                        tagLogic.addItem(addIds[i], this._cmd.proxy.getResData(cellId));
                    }

                    if (this._cmd.buildProxy.getBuild(cellId) != null) {
                        buildTipsLogic.addItem(addIds[i], this._cmd.buildProxy.getBuild(cellId));
                    }

                    //城池
                    if (this._cmd.cityProxy.getCity(cellId) != null) {
                        cityLogic.addItem(addIds[i], this._cmd.cityProxy.getCity(cellId));
                    }

                }
            }
        }
    }

    protected onScrollToMap(x: number, y: number): void {
        this.node.getComponent(MapLogic).scrollToMapPoint(new Vec2(x, y));
    }
}
