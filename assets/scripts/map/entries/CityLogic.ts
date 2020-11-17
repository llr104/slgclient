import { MapCityData } from "../MapProxy";

const { ccclass, property } = cc._decorator;

@ccclass
export default class CityLogic extends cc.Component {

    @property(cc.SpriteAtlas)
    buildAtlas: cc.SpriteAtlas = null;

    protected _data: MapCityData = null;

    protected onLoad(): void {

    }

    protected onDestroy(): void {

    }

    public setCityData(data: MapCityData): void {

    }
}