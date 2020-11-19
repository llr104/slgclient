import MapBuildLogic from "../map/MapBuildLogic";
import MapCityLogic from "../map/MapCityLogic";
import MapCommand from "../map/MapCommand";
import MapLogic from "../map/MapLogic";
import { MapAreaData, MapCityData, MapResType } from "../map/MapProxy";
import MapResLogic from "../map/MapResLogic";
import MapUtil from "../map/MapUtil";

const { ccclass, property } = cc._decorator;

@ccclass
export default class MapScene extends cc.Component {
    @property(cc.Node)
    mapLayer: cc.Node = null;
    @property(cc.Node)
    resLayer: cc.Node = null;
    @property(cc.Node)
    buildLayer: cc.Node = null;
    @property(cc.Node)
    armyLayer: cc.Node = null;

    protected _cmd: MapCommand = null;

    protected onLoad(): void {
        console.log("MapScene onLoad", this.mapLayer);
        this._cmd = MapCommand.getInstance();

        //初始化地图
        let tiledMap: cc.TiledMap = this.mapLayer.addComponent(cc.TiledMap);
        tiledMap.tmxAsset = this._cmd.proxy.tiledMapAsset;
        MapUtil.initMapConfig(tiledMap);
        this._cmd.proxy.init();
        cc.systemEvent.on("map_show_area_change", this.onMapShowAreaChange, this);
        this.scheduleOnce(() => {
            let myCity: MapCityData = this._cmd.proxy.getMyMainCity();
            this.node.getComponent(MapLogic).setTiledMap(tiledMap);
            this.node.getComponent(MapLogic).scrollToMapPoint(cc.v2(myCity.x, myCity.y));
            this.onTimer();//立即执行一次
        });
        this.schedule(this.onTimer, 0.2);
    }

    protected onDestroy(): void {
        console.log("MapScene onDestroy");
        cc.systemEvent.targetOff(this);
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
    }

    protected onMapShowAreaChange(centerPoint: cc.Vec2, centerAreaId: number, addIds: number[], removeIds: number[]): void {
        console.log("map_show_area_change", arguments);
        let resLogic: MapResLogic = this.node.getComponent(MapResLogic);
        let buildLogic: MapBuildLogic = this.node.getComponent(MapBuildLogic);
        let cityLogic: MapCityLogic = this.node.getComponent(MapCityLogic);

        //更新展示区域
        resLogic.udpateShowAreas(addIds, removeIds);
        buildLogic.udpateShowAreas(addIds, removeIds);
        cityLogic.udpateShowAreas(addIds, removeIds);

        //更新区域内的具体节点
        for (let i: number = 0; i < addIds.length; i++) {
            let areaData: MapAreaData = this._cmd.proxy.getMapAreaData(addIds[i]);
            // console.log("areaData", areaData);
            for (let x: number = areaData.startCellX; x < areaData.endCellX; x++) {
                for (let y: number = areaData.startCellY; y < areaData.endCellY; y++) {
                    let cellId: number = MapUtil.getIdByCellPoint(x, y);
                    //资源
                    if (this._cmd.proxy.getResData(cellId).type >= MapResType.WOOD) {
                        resLogic.addItem(addIds[i], this._cmd.proxy.getResData(cellId));
                    }
                    //建筑
                    if (this._cmd.proxy.getBuild(cellId) != null) {
                        buildLogic.addItem(addIds[i], this._cmd.proxy.getBuild(cellId));
                    }
                    //城池
                    if (this._cmd.proxy.getCity(cellId) != null) {
                        cityLogic.addItem(addIds[i], this._cmd.proxy.getCity(cellId));
                    }
                }
            }
        }
    }
}
