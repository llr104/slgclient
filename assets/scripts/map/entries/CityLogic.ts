import { _decorator, Component, Label, Sprite, SpriteAtlas, Node } from 'cc';
const { ccclass, property } = _decorator;

import DateUtil from "../../utils/DateUtil";
import { MapCityData } from "../MapCityProxy";
import MapCommand from "../MapCommand";
import { EventMgr } from '../../utils/EventMgr';

@ccclass('CityLogic')
export default class CityLogic extends Component {
    @property(Label)
    labelName: Label | null = null;
    @property(Sprite)
    upSpr: Sprite | null = null;
    @property(Sprite)
    downSpr: Sprite | null = null;
    @property(SpriteAtlas)
    resourceAtlas: SpriteAtlas | null = null;
    @property(Node)
    mianNode: Node | null = null;
    protected _data: MapCityData = null;
    protected _limitTime: number = 0;
    protected onLoad(): void {
        this._limitTime = MapCommand.getInstance().proxy.getWarFree();
    }
    protected onDestroy(): void {

    }
    protected onEnable(): void {
        EventMgr.on("unionChange", this.onUnionChange, this);
    }
    protected onDisable(): void {
        this._data = null;
        this.unscheduleAllCallbacks();
        EventMgr.targetOff(this);
    }
    protected onUnionChange(rid: number, unionId: number, parentId: number): void {
        if (this._data.rid == rid ){
        this._data.unionId = unionId;
        this._data.parentId = parentId;
        }
        this.updateUI();
    }
    public setCityData(data: MapCityData): void {
        this._data = data;
        console.log("setCityData:", data);
        this.updateUI();
    }
    public updateUI(): void {
        if (this._data) {
        this.labelName.string = this._data.name;

        if (this._data.rid == MapCommand.getInstance().buildProxy.myId) {
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

