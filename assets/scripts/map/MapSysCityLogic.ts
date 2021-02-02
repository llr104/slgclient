import MapBaseLayerLogic from "./MapBaseLayerLogic";
import MapUtil from "./MapUtil";
import SysCityLogic from "./entries/SysCityLogic";
import { MapBuildData } from "./MapBuildProxy";

const { ccclass, property } = cc._decorator;

@ccclass
export default class MapSysCityLogic extends MapBaseLayerLogic {

    public setItemData(item: cc.Node, data: any): void {
        let cityData: MapBuildData = data as MapBuildData;
        let position: cc.Vec2 = MapUtil.mapCellToPixelPoint(cc.v2(cityData.x, cityData.y));
        item.setPosition(position);
        item.getComponent(SysCityLogic).setCityData(cityData);
    }

    public getIdByData(data: any): number {
        return (data as MapBuildData).id;
    }
}