import { _decorator, Component, Sprite, SpriteAtlas } from 'cc';
const { ccclass, property } = _decorator;

import {MapResData, MapResType } from "../MapProxy";

@ccclass('ResLogic')
export default class ResLogic extends Component {
    @property(Sprite)
    spr: Sprite = null;
    @property(SpriteAtlas)
    resourceAtlas1: SpriteAtlas = null;

    @property(SpriteAtlas)
    resourceAtlas2: SpriteAtlas = null;

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
