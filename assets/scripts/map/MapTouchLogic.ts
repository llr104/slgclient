import MapCommand from "./MapCommand";
import { MapBuildData, MapCityData, MapResConfig } from "./MapProxy";

const { ccclass, property } = cc._decorator;

@ccclass
export default class MapResLogic extends cc.Component {
    protected _cmd: MapCommand;

    protected onLoad(): void {
        this._cmd = MapCommand.getInstance();
        cc.systemEvent.on("touch_map", this.onTouchMap, this);
    }

    protected onDestroy(): void {
        cc.systemEvent.targetOff(this);
        this._cmd = null;
    }

    protected onTouchMap(mapPoint: cc.Vec2, clickCenterPoint: cc.Vec2): void {
        console.log("点击区域 (" + mapPoint.x + "," + mapPoint.y + ")");
        if (this._cmd.proxy.isVaildCellPoint(mapPoint) == false) {
            console.log("点击到无效区域");
            return;
        }

        let areaIndex = this._cmd.proxy.getAreaIndexByCellPoint(mapPoint);
        let cityId: number = this._cmd.proxy.getMapCityIdForPos(mapPoint.x, mapPoint.y);
        let key: string = mapPoint.x + "_" + mapPoint.y;
        console.log("cityIds", areaIndex, cityId);
        if (cityId > 0) {
            //代表点击的是城市
            let cityData: MapCityData = this._cmd.proxy.getCity(cityId);
            console.log("点击城市", cityData);
            cc.systemEvent.emit("open_facility", cityData);
            return;
        }
        let buildMap: Map<string, MapBuildData> = this._cmd.proxy.getMapAreaBuilds(areaIndex);
        if (buildMap.has(key)) {
            //代表点击被占领的区域
            console.log("点击被占领的区域", buildMap.get(key));
            return;
        }

        let resDataList: Array<Array<MapResConfig>> = this._cmd.proxy.mapResConfigs;
        console.log("点击野外区域", resDataList[mapPoint.x][mapPoint.y]);
    }

    public updateNodeByArea(areaIndex: number): void {

    }

    public updateEntry(node: cc.Node, data: any): void {

    }
}