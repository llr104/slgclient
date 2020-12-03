import MapBaseLayerLogic from "./MapBaseLayerLogic";
import CityLogic from "./entries/CityLogic";
import MapUtil from "./MapUtil";
import { MapCityData } from "./MapCityProxy";

const { ccclass, property } = cc._decorator;

@ccclass
export default class MapCityLogic extends MapBaseLayerLogic {

    protected onLoad(): void {
        super.onLoad();
        cc.systemEvent.on("update_citys", this.onUpdateCitys, this);
        cc.systemEvent.on("update_city", this.onUpdateCity, this);
    }

    protected onDestroy(): void {
        cc.systemEvent.targetOff(this);
        super.onDestroy();
    }

    protected onUpdateCitys(areaIndex: number, addIds: number[], removeIds: number[], updateIds: number[]): void {
        // console.log("update_citys", arguments);
        if (this._itemMap.has(areaIndex)) {
            for (let i: number = 0; i < addIds.length; i++) {
                this.addItem(areaIndex, this._cmd.cityProxy.getCity(addIds[i]));
            }
            for (let i: number = 0; i < removeIds.length; i++) {
                this.removeItem(areaIndex, removeIds[i]);
            }
            for (let i: number = 0; i < updateIds.length; i++) {
                this.updateItem(areaIndex, this._cmd.cityProxy.getCity(updateIds[i]));
            }
        }
    }

    protected onUpdateCity(city:MapCityData):void {
        let areaIndex:number = MapUtil.getAreaIdByCellPoint(city.x, city.y);
        if (this._itemMap.has(areaIndex)) {
            this.addItem(areaIndex, city);
        }
    }

    public setItemData(item: cc.Node, data: any): void {
        let cityData: MapCityData = data as MapCityData;
        let position: cc.Vec2 = MapUtil.mapCellToPixelPoint(cc.v2(cityData.x, cityData.y));
        item.setPosition(position);
        item.getComponent(CityLogic).setCityData(cityData);
    }

    public getIdByData(data: any): number {
        return (data as MapCityData).cityId;
    }
}