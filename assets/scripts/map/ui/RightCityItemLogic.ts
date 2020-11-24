import { MapCityData } from "../MapCityProxy";

const { ccclass, property } = cc._decorator;

@ccclass
export default class RightCityItemLogic extends cc.Component {
    @property(cc.Label)
    labelInfo: cc.Label = null;
    @property(cc.Label)
    labelPos: cc.Label = null;

    protected _data: MapCityData = null;


    protected onLoad(): void {
        
    }

    protected onDestroy(): void {
        this._data = null;
    }

    protected onClickBg(): void {
        if (this._data) {
            cc.systemEvent.emit("scroll_top_map", this._data.x, this._data.y);
        }
    }

    public setArmyData(data: MapCityData): void {
        this._data = data;
        if (this._data) {
            this.labelInfo.string = this._data.name;
            this.labelPos.string = "(" + this._data.x + ", " + this._data.y + ")";
        }
    }
}