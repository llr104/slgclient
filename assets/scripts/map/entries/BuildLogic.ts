import { MapBuildAscription, MapBuildData } from "../MapBuildProxy";
import MapCommand from "../MapCommand";

const { ccclass, property } = cc._decorator;

@ccclass
export default class BuildLogic extends cc.Component {
    @property(cc.Sprite)
    spr: cc.Sprite = null;
    @property(cc.SpriteAtlas)
    buildAtlas: cc.SpriteAtlas = null;

    protected _data: MapBuildData = null;

    protected onLoad(): void {

    }

    protected onDestroy(): void {
        this._data = null;
    }

    public setBuildData(data: MapBuildData): void {
        this._data = data;
        if (this._data) {
            if (this._data.ascription == MapBuildAscription.Me) {
                this.spr.spriteFrame = this.buildAtlas.getSpriteFrame("expansion_of_tips_1_1");
            } else {
                this.spr.spriteFrame = this.buildAtlas.getSpriteFrame("expansion_of_tips_3_1");
            }
        }
    }
}