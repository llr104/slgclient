import { _decorator, Node, Vec2, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

import MapBaseLayerLogic from "./MapBaseLayerLogic";
import CityLogic from "./entries/CityLogic";
import MapUtil from "./MapUtil";
import { MapCityData } from "./MapCityProxy";
import { EventMgr } from '../utils/EventMgr';

@ccclass('MapCityLogic')

export default class MapCityLogic extends MapBaseLayerLogic {

    protected onLoad(): void {
        super.onLoad();
        EventMgr.on("update_citys", this.onUpdateCitys, this);
        EventMgr.on("update_city", this.onUpdateCity, this);
    }

    protected onDestroy(): void {
        EventMgr.targetOff(this);
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

    public setItemData(item: Node, data: any): void {
        let cityData: MapCityData = data as MapCityData;
        let position: Vec2 = MapUtil.mapCellToPixelPoint(new Vec2(cityData.x, cityData.y));
        item.setPosition(new Vec3(position.x, position.y, 0));
        item.getComponent(CityLogic).setCityData(cityData);
    }

    public getIdByData(data: any): number {
        return (data as MapCityData).cityId;
    }
}
