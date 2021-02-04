import {MapResData, MapResType } from "../MapProxy";

const { ccclass, property } = cc._decorator;

@ccclass
export default class ResLogic extends cc.Component {
    @property(cc.Sprite)
    spr: cc.Sprite = null;
    @property(cc.SpriteAtlas)
    resourceAtlas1: cc.SpriteAtlas = null;

    @property(cc.SpriteAtlas)
    resourceAtlas2: cc.SpriteAtlas = null;

    protected _data: MapResData = null;

    protected onLoad(): void {

    }

    protected onDestroy(): void {

    }

    public setResourceData(data: MapResData): void {
        this._data = data;
        
        
        if (data.type == MapResType.WOOD) {
            //木头
            if(data.level == 1){
                this.spr.spriteFrame = this.resourceAtlas1.getSpriteFrame("land_ground_1_1");
            }else if(data.level == 2){
                this.spr.spriteFrame = this.resourceAtlas1.getSpriteFrame("land_ground_2_1");
            }else{
                this.spr.spriteFrame = this.resourceAtlas2.getSpriteFrame("land_2_" + (data.level-2));
            }
           
        } else if (data.type == MapResType.IRON) {
            //铁
            if(data.level == 1){
                this.spr.spriteFrame = this.resourceAtlas1.getSpriteFrame("land_ground_1_1");
            }else if(data.level == 2){
                this.spr.spriteFrame = this.resourceAtlas1.getSpriteFrame("land_ground_2_1");
            }else{
                this.spr.spriteFrame = this.resourceAtlas2.getSpriteFrame("land_4_" + (data.level-2));
            }
            
        } else if (data.type == MapResType.STONE) {
            //石头
            if(data.level == 1){
                this.spr.spriteFrame = this.resourceAtlas1.getSpriteFrame("land_ground_1_1");
            }else if(data.level == 2){
                this.spr.spriteFrame = this.resourceAtlas1.getSpriteFrame("land_ground_2_1");
            }else{
                this.spr.spriteFrame = this.resourceAtlas2.getSpriteFrame("land_2_" + (data.level-2));
            }
        } else if (data.type == MapResType.GRAIN) {
            //田
            if(data.level == 1){
                this.spr.spriteFrame = this.resourceAtlas1.getSpriteFrame("land_ground_1_1");
            }else if(data.level == 2){
                this.spr.spriteFrame = this.resourceAtlas1.getSpriteFrame("land_ground_2_1");
            }else{
                this.spr.spriteFrame = this.resourceAtlas2.getSpriteFrame("land_1_" + (data.level-2));
            }
        } else if (data.type == MapResType.SYS_FORTRESS) {
            //系统要塞
            this.spr.spriteFrame = this.resourceAtlas2.getSpriteFrame("sys_fortress");
        }else {
            this.spr.spriteFrame = null;
        }
       
    }
}