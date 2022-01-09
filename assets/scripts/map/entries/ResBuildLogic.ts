import { _decorator, Component, Sprite, SpriteAtlas } from 'cc';
const { ccclass, property } = _decorator;

import { MapBuildData } from "../MapBuildProxy";
import MapCommand from "../MapCommand";
import { EventMgr } from '../../utils/EventMgr';


@ccclass('ResBuildLogic')
export default class ResBuildLogic extends Component {
    @property(Sprite)
    upSpr: Sprite | null = null;
    @property(Sprite)
    downSpr: Sprite | null = null;
    @property(SpriteAtlas)
    resourceAtlas: SpriteAtlas | null = null;
    protected _data: MapBuildData = null;
    protected onLoad(): void {

    }
    protected onDestroy(): void {

    }
    protected onEnable():void {
        EventMgr.on("unionChange", this.onUnionChange, this);
    }
    protected onDisable():void {
        this._data = null;
        EventMgr.targetOff(this);
    }
    protected onUnionChange(rid: number, unionId: number, parentId: number): void {
        if (this._data.rid == rid ){
        this._data.unionId = unionId;
        this._data.parentId = parentId;
        }
        this.updateUI();
     }
 
     public setBuildData(data: MapBuildData): void {
        this._data = data;
        this.updateUI();
     }
    public updateUI(): void {

        if (this._data) {
        if(!this._data.rid){
        this.upSpr.spriteFrame = null;
        this.downSpr.spriteFrame = null;
        }else if (this._data.rid == MapCommand.getInstance().buildProxy.myId) {
        this.upSpr.spriteFrame = this.resourceAtlas.getSpriteFrame("blue_2_3");
        this.downSpr.spriteFrame = this.resourceAtlas.getSpriteFrame("blue_1_3");
        } else if (this._data.unionId > 0 && this._data.unionId == MapCommand.getInstance().buildProxy.myUnionId) {
        this.upSpr.spriteFrame = this.resourceAtlas.getSpriteFrame("green_2_3");
        this.downSpr.spriteFrame = this.resourceAtlas.getSpriteFrame("green_1_3");
        }else if (this._data.unionId > 0 && this._data.unionId == MapCommand.getInstance().buildProxy.myParentId) {
        this.upSpr.spriteFrame = this.resourceAtlas.getSpriteFrame("purple_2_3");
        this.downSpr.spriteFrame = this.resourceAtlas.getSpriteFrame("purple_1_3");
        } else if (this._data.parentId > 0 && this._data.parentId == MapCommand.getInstance().buildProxy.myUnionId) {
        this.upSpr.spriteFrame = this.resourceAtlas.getSpriteFrame("yellow_2_3");
        this.downSpr.spriteFrame = this.resourceAtlas.getSpriteFrame("yellow_1_3");
        }else {
        this.upSpr.spriteFrame = this.resourceAtlas.getSpriteFrame("red_2_3");
        this.downSpr.spriteFrame = this.resourceAtlas.getSpriteFrame("red_1_3");
        }
        }
    }
}
