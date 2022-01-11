import { _decorator, Component, Sprite, SpriteAtlas, Node, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

import DateUtil from "../../utils/DateUtil";
import MapCommand from "../MapCommand";
import { MapResType } from "../MapProxy";
import { EventMgr } from '../../utils/EventMgr';

@ccclass('SysCityLogic')
export default class SysCityLogic extends Component {

    @property(Sprite)
    upSpr: Sprite = null;

    @property(Sprite)
    downSpr: Sprite = null;

    @property(SpriteAtlas)
    resourceAtlas: SpriteAtlas = null;

    @property(Node)
    mianNode: Node = null;

    protected _limitTime: number = 0;
    protected _data: any = null;


    protected onLoad(): void {
        this._limitTime = MapCommand.getInstance().proxy.getWarFree();
    }

    protected onEnable(): void {
        EventMgr.on("unionChange", this.onUnionChange, this);
    }

    protected onDisable(): void {
        this._data = null;
        this.unscheduleAllCallbacks();
        EventMgr.targetOff(this);
    }

    public setCityData(data: any): void {
        // console.log("setCityData:", data);
        this._data = data;
        this.updateUI();
    }

    protected onUnionChange(rid: number, unionId: number, parentId: number): void {
        if (this._data.rid == rid ){
            this._data.unionId = unionId;
            this._data.parentId = parentId;
        }
        this.updateUI();
    }


    public updateUI(): void {
        if(this._data.type != MapResType.SYS_CITY){
            this.node.active = false;
            return
        }else{
            this.node.active = true;
        }

        if(this._data.level >= 8){
            this.node.scale = new Vec3(1.5, 1.5, 1.5);
        }else if(this._data.level >= 5){
            this.node.scale = new Vec3(1, 1, 1);
        }else {
            this.node.scale = new Vec3(0.5, 0.5, 0.5);
        }

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

        var diff = DateUtil.getServerTime() - this._data.occupyTime;
        console.log("diff", diff, this._limitTime);
        if (this._data.parentId > 0 && diff<this._limitTime){
            this.mianNode.active = true;
            this.stopCountDown();
            this.schedule(this.countDown, 1.0);
        }else{
            this.mianNode.active = false;
        }
    }

    public countDown() {
        var diff = DateUtil.getServerTime() - this._data.occupyTime;
        if (diff>this._limitTime){
            this.stopCountDown();
            this.mianNode.active = false;
        }
    }

    public stopCountDown() {
        this.unscheduleAllCallbacks();
    }
}
