import {MapResData, MapResType } from "../MapProxy";

const { ccclass, property } = cc._decorator;

@ccclass
export default class ResLogic extends cc.Component {
    @property(cc.Sprite)
    spr: cc.Sprite = null;
    @property(cc.SpriteAtlas)
    resourceAtlas: cc.SpriteAtlas = null;

    protected _data: MapResData = null;

    protected onLoad(): void {

    }

    protected onDestroy(): void {

    }

    public setResourceData(data: MapResData): void {
        this._data = data;
        if (data.type == MapResType.WOOD) {
            //木头
            this.spr.spriteFrame = this.resourceAtlas.getSpriteFrame("build_wood");
        } else if (data.type == MapResType.IRON) {
            //铁
            this.spr.spriteFrame = this.resourceAtlas.getSpriteFrame("build_iron");
        } else if (data.type == MapResType.STONE) {
            //石头
            this.spr.spriteFrame = this.resourceAtlas.getSpriteFrame("build_stone");
        } else if (data.type == MapResType.GRAIN) {
            //田
            this.spr.spriteFrame = this.resourceAtlas.getSpriteFrame("build_food");
        }
    }
}