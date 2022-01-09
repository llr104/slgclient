import { _decorator, Component, Label, Node } from 'cc';
const { ccclass, property } = _decorator;

import DateUtil from "../../utils/DateUtil";
import { Facility, FacilityConfig } from "./MapUIProxy";
import { EventMgr } from '../../utils/EventMgr';

@ccclass('FacilityItemLogic')
export default class FacilityItemLogic extends Component {
    @property(Label)
    labelRate: Label = null;
    @property(Label)
    labelName: Label = null;

    @property(Label)
    labelTime: Label = null;

    @property(Node)
    lockNode: Node = null;

    public type: number = 0;
    public isUnlock: boolean = false;
    public cityId: number = 0;
    public data: Facility = null;
    public cfg: FacilityConfig = null;

    protected onLoad(): void {
        this.node.on(Node.EventType.TOUCH_END, this.onTouchItem, this);
    }

    protected onDestroy(): void {
        this.node.off(Node.EventType.TOUCH_END, this.onTouchItem, this);
        EventMgr.targetOff(this);
    }

    protected updateItem(): void {
        this.labelRate.string = this.data.level + "/" + this.cfg.upLevels.length;
        this.labelName.string = this.cfg.name;
        this.lockNode.active = !this.isUnlock;
    }

    protected onTouchItem() {
        EventMgr.emit("select_facility_item", this.cityId, this.data.type);
    }

    public setData(cityId: number, data: Facility, cfg:FacilityConfig, isUnlock:boolean): void {
        // console.log("setData:", data);

        this.cityId = cityId;
        this.data = data;
        this.cfg = cfg;
        this.isUnlock = isUnlock;
        
        if(this.data.isUping()){
            this.startUpTime();
        }else{
            this.stopCountDown();
        }
 
        this.updateItem();
    }

    protected countDown(){
        if (this.data.isUping()){
            this.labelTime.string = DateUtil.converSecondStr(this.data.upLastTime());
        }else{
            this.stopCountDown();
        }
    }

    protected stopCountDown(){
        this.unscheduleAllCallbacks();
        this.labelTime.string = "";
    }

    protected startUpTime(){
        this.stopCountDown();
        this.schedule(this.countDown, 1.0);
        this.countDown();
    }
}
