import DateUtil from "../../utils/DateUtil";
import { MapBuildData } from "../MapBuildProxy";
import MapCommand from "../MapCommand";
// import MapCommand from "../MapCommand";

const { ccclass, property } = cc._decorator;

@ccclass
export default class BuildTipsLogic extends cc.Component {
    @property(cc.Sprite)
    warFreeSprite: cc.Sprite = null;

    protected _data: MapBuildData = null;
    protected _warFreeTime: number = 0;

    @property(cc.Node)
    giveUpNode: cc.Node = null;

    @property(cc.Label)
    giveUpLabTime: cc.Label = null;

    protected onLoad(): void {
       
    }

    protected onEnable(): void {
        this.giveUpNode.active = false;
        this._warFreeTime = MapCommand.getInstance().proxy.getWarFree();
    }

    protected onDestroy(): void {
        this._data = null;
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

            this.startGiveUp();
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