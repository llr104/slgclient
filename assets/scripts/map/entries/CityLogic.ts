import { MapCityData } from "../MapCityProxy";

const { ccclass, property } = cc._decorator;

@ccclass
export default class CityLogic extends cc.Component {
    @property(cc.Label)
    labelName: cc.Label = null;
    @property(cc.Sprite)
    spr: cc.Sprite = null;
    @property(cc.SpriteAtlas)
    buildAtlas: cc.SpriteAtlas = null;

    protected _data: MapCityData = null;

    protected onLoad(): void {

    }

    protected onDestroy(): void {
        this._data = null;
    }

    public setCityData(data: MapCityData): void {
        this._data = data;
        if (this._data) {
            this.labelName.string = this._data.name;
        }
        
    }
}