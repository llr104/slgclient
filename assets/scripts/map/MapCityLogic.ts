import { MapAreaData, MapCityData, MapResConfig, MapResType } from "./MapProxy";
import MapBaseLayerLogic from "./MapBaseLayerLogic";
import CityLogic from "./entries/CityLogic";
import MapCommand from "./MapCommand";

const { ccclass, property } = cc._decorator;

@ccclass
export default class MapCityLogic extends MapBaseLayerLogic {

    protected onLoad(): void {
        super.onLoad();
        cc.systemEvent.on("update_citys", this.onUpdateCitys, this);
    }

    protected onDestroy(): void {
        cc.systemEvent.targetOff(this);
        super.onDestroy();
    }

    protected onUpdateCitys(areaIndex: number, addCitys: MapCityData[], removeCityIds: number[], updateCitys: MapCityData[]): void {
        console.log("update_citys", arguments);
        for (let i: number = 0; i < addCitys.length; i++) {
            this.addItem(areaIndex, addCitys[i]);
        }
        for (let i: number = 0; i < removeCityIds.length; i++) {
            this.removeItem(areaIndex, removeCityIds[i]);
        }
        for (let i: number = 0; i < updateCitys.length; i++) {
            this.updateItem(areaIndex, updateCitys[i]);
        }
    }

    public updateNodeByArea(areaIndex: number): void {
        let cityIds: number[] = this._cmd.proxy.getMapCityIdsForArea(areaIndex);
        for (let i: number = 0; i < cityIds.length; i++) {
            this.addItem(areaIndex, this._cmd.proxy.getCity(cityIds[i]));
        }
    }

    public setItemData(item: cc.Node, data: any): void {
        let cityData: MapCityData = data as MapCityData;
        let position: cc.Vec2 = this._cmd.proxy.mapCellToPixelPoint(cc.v2(cityData.x, cityData.y));
        item.setPosition(position);
        item.getComponent(CityLogic).setCityData(cityData);
    }

    public getIdByData(data: any): number {
        return (data as MapCityData).cityId;
    }
}