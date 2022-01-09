import { _decorator, Component, Sprite, Node, Label } from 'cc';
const { ccclass, property } = _decorator;

import DateUtil from "../../utils/DateUtil";
import { MapBuildData } from "../MapBuildProxy";
import MapCommand from "../MapCommand";
import { EventMgr } from '../../utils/EventMgr';

@ccclass('BuildTipsLogic')
export default class BuildTipsLogic extends Component {
    @property(Sprite)
    warFreeSprite: Sprite | null = null;
    protected _data: MapBuildData = null;
    protected _warFreeTime: number = 0;
    @property(Node)
    giveUpNode: Node | null = null;
    @property(Label)
    giveUpLabTime: Label | null = null;
 
    protected onLoad(): void {

    }
    protected onEnable(): void {
        this.giveUpNode.active = false;
        this._warFreeTime = MapCommand.getInstance().proxy.getWarFree();
    }
    protected onDisable(): void {
        this._data = null;
        this.unscheduleAllCallbacks();
        EventMgr.targetOff(this);
    }
     public setBuildData(data: MapBuildData): void {
        this._data = data;
        this.updateUI();
     }
    public updateUI(): void {
        if (this._data) {
        var diff = DateUtil.getServerTime() - this._data.occupyTime;
        var isShow = diff<this._warFreeTime && this._data.rid > 0;
        this.warFreeSprite.node.active = isShow;

        if (isShow){
        this.stopWarFree();
        this.schedule(this.countDownWarFree, 1.0);
        this.countDownWarFree();
        }
        if(this._data.rid == MapCommand.getInstance().cityProxy.myId){
        this.startGiveUp();
        }
        }
    }
    public countDownWarFree() {
        var diff = DateUtil.getServerTime() - this._data.occupyTime;
        if (diff>this._warFreeTime){
        this.stopWarFree();
        this.warFreeSprite.node.active = false;
        }
    }
    public stopWarFree() {
        this.unschedule(this.countDownWarFree);
    }
    protected startGiveUp(){
        this.stopGiveUp();
        this.schedule(this.updateGiveUpTime, 1);
        this.updateGiveUpTime();
    }
    protected stopGiveUp(){
        this.unschedule(this.updateGiveUpTime);
        this.giveUpNode.active = false;
    }
    protected updateGiveUpTime(){
        if (this._data.isInGiveUp() == false){
        this.stopGiveUp();
        }else{
        this.giveUpNode.active = true;
        this.giveUpLabTime.string = DateUtil.leftTimeStr(this._data.giveUpTime);
        }
    }
}

