import { MapAreaData, MapCityData, MapResConfig, MapResType } from "./MapProxy";
import MapEntryLayerLogic from "./MapEntryLayerLogic";
import CityLogic from "./entries/CityLogic";

const { ccclass, property } = cc._decorator;

@ccclass
export default class MapCityLogic extends MapEntryLayerLogic {

    protected onLoad(): void {
        super.onLoad();
        cc.systemEvent.on("update_citys", this.onUpdateCitys, this);
    }

    protected onDestroy(): void {
        cc.systemEvent.targetOff(this);
        super.onDestroy();
    }

    protected onUpdateCitys(areaIndex: number): void {
        this.removeArea(areaIndex);
        this.updateNodeByArea(areaIndex);
    }

    public updateNodeByArea(areaIndex: number): void {
        let cityMap: Map<number, MapCityData> = this._cmd.proxy.getMapAreaCitys(areaIndex);
        cityMap.forEach((city: MapCityData, key: number) => {
            this.addEntry(city.x, city.y, city);
        });
    }

    public updateEntry(node: cc.Node, data: any): void {
        node.getComponent(CityLogic).setCityData(data);
    }
}