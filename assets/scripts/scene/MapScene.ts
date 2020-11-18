import MapBuildLogic from "../map/MapBuildLogic";
import MapCityLogic from "../map/MapCityLogic";
import MapCommand from "../map/MapCommand";
import MapLogic from "../map/MapLogic";
import { MapAreaRectData, MapAreaData, MapCityData } from "../map/MapProxy";
import MapResLogic from "../map/MapResLogic";

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
        this._cmd = MapCommand.getInstance();

        //初始化地图
        let tiledMap: cc.TiledMap = this.mapLayer.addComponent(cc.TiledMap);
        tiledMap.tmxAsset = this._cmd.proxy.tiledMapAsset;
        this._cmd.proxy.initMapConfig(tiledMap);
        this._cmd.proxy.initMyCityData();
        cc.systemEvent.on("map_show_area_change", this.onCenterChange, this);
        this.scheduleOnce(() => {
            let myCity: MapCityData = this._cmd.proxy.getMyMainCity();
            this.node.getComponent(MapLogic).setTiledMap(tiledMap);
            this.node.getComponent(MapLogic).scrollToMapPoint(cc.v2(myCity.x, myCity.y));
            this.onTimer();//立即执行一次
        });
        this.schedule(this.onTimer, 0.2);
    }

    protected onDestroy(): void {
        cc.systemEvent.targetOff(this);
    }

    protected onTimer(): void {
        if (this._cmd.proxy.qryMapAreaList && this._cmd.proxy.qryMapAreaList.length > 0) {
            let qryIndex: number = this._cmd.proxy.qryMapAreaList.shift();
            let qryData: MapAreaData = this._cmd.proxy.getMapAreaData(qryIndex);
            if (qryData.checkAndUpdateQryTime()) {
                this._cmd.qryNationMapScanBlock(qryData);
            }
        }
    }

    protected onCenterChange(centerPoint: cc.Vec2, showArea: MapAreaRectData): void {
        this.node.getComponent(MapResLogic).udpateShowAreas(showArea.addIndexs, showArea.removeIndexs);
        this.node.getComponent(MapBuildLogic).udpateShowAreas(showArea.addIndexs, showArea.removeIndexs);
        this.node.getComponent(MapCityLogic).udpateShowAreas(showArea.addIndexs, showArea.removeIndexs);
    }
}
