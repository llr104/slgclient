import DateUtil from "../../utils/DateUtil";
import MapUICommand from "./MapUICommand";
import { Facility, FacilityConfig } from "./MapUIProxy";

const { ccclass, property } = cc._decorator;

@ccclass
export default class FacilityItemLogic extends cc.Component {
    @property(cc.Label)
    labelRate: cc.Label = null;
    @property(cc.Label)
    labelName: cc.Label = null;

    @property(cc.Label)
    labelTime: cc.Label = null;

    @property(cc.Node)
    lockNode: cc.Node = null;

    public type: number = 0;
    public isUnlock: boolean = false;
    public cityId: number = 0;
    public data: Facility = null;
    public cfg: FacilityConfig = null;

    protected onLoad(): void {
        this.node.on(cc.Node.EventType.TOUCH_END, this.onTouchItem, this);
    }

    protected onDestroy(): void {
        this.node.off(cc.Node.EventType.TOUCH_END, this.onTouchItem, this);
        cc.systemEvent.targetOff(this);
    }

    protected updateItem(): void {
        this.labelRate.string = this.data.level + "/" + this.cfg.upLevels.length;
        this.labelName.string = this.cfg.name;
        this.lockNode.active = !this.isUnlock;
    }

    protected onTouchItem() {
        cc.systemEvent.emit("select_facility_item", this.cityId, this.data.type);
    }

    public setData(cityId: number, data: Facility, cfg:FacilityConfig, isUnlock:boolean): void {
        console.log("setData:", data);

        this.cityId = cityId;
        this.data = data;
        this.cfg = cfg;
        this.isUnlock = isUnlock;
        
        if(this.data.upTime > 0){
            this.startUpTime();
        }else{
            this.stopCountDown();
        }
 
        this.updateItem();
    }

    protected countDown(){
        var costTime = this.cfg.upLevels[this.data.level+1].time;
        var serverTime = DateUtil.getServerTime();
        var diff =  (this.data.upTime+costTime)*1000 - serverTime;
        if (diff>0){
            this.labelTime.string = DateUtil.converSecondStr(diff);
        }else{
            //倒计时完，请求最新的等级
            MapUICommand.getInstance().qryCityFacilities(this.cityId);
            this.stopCountDown();
        }
    }

    protected stopCountDown(){
        this.unscheduleAllCallbacks();
        this.labelTime.string = "";
    }

    protected startUpTime(){
        this.stopCountDown();
        this.schedule(this.countDown.bind(this), 1.0);
        this.countDown();
    }
}
