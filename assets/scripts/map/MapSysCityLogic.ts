import MapBaseLayerLogic from "./MapBaseLayerLogic";
import CityLogic from "./entries/CityLogic";
import MapUtil from "./MapUtil";
import { MapCityData } from "./MapCityProxy";
import SysCityLogic from "./entries/SysCityLogic";
import { MapResData } from "./MapProxy";

const { ccclass, property } = cc._decorator;

@ccclass
export default class MapSysCityLogic extends MapBaseLayerLogic {

    public setItemData(item: cc.Node, data: any): void {
        let cityData: MapResData = data as MapResData;
        let position: cc.Vec2 = MapUtil.mapCellToPixelPoint(cc.v2(cityData.x, cityData.y));
        item.setPosition(position);
        item.getComponent(SysCityLogic).setCityData(cityData);
    }

    public getIdByData(data: any): number {
        return (data as MapResData).id;
    }
}