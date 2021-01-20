// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import LoginCommand from "../../login/LoginCommand";
import DateUtil from "../../utils/DateUtil";
import { Tools } from "../../utils/Tools";
import MapUICommand from "./MapUICommand";

const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    @property(cc.Label)
    cdLab: cc.Label = null;

    @property(cc.Label)
    timesLab: cc.Label = null;

    @property(cc.Label)
    goldLab: cc.Label = null;

    @property(cc.Button)
    collectBtn: cc.Button = null;

    _data: any = null;

    protected onEnable():void{
        console.log("add interior_openCollect");
        cc.systemEvent.on("interior_openCollect", this.onOpenCollect, this);
        cc.systemEvent.on("interior_collect", this.onCollect, this);

        var roleRes = LoginCommand.getInstance().proxy.getRoleResData();
        this.goldLab.string = Tools.numberToShow(roleRes.gold_yield);

        MapUICommand.getInstance().interiorOpenCollect();
    }


    protected onDisable():void{
        cc.systemEvent.targetOff(this);
    }

    protected onOpenCollect(msg:any):void{
        console.log("onOpenCollect:", msg);
        this._data = msg;
        this.startCountDown();
    }

    protected onCollect(msg:any):void{
        console.log("onOpenCollect:", msg);
        this._data = msg;
        this.startCountDown();
    }

    protected onClickClose(): void {
        this.node.active = false;
    }

    protected onClickCollect(): void{
        MapUICommand.getInstance().interiorCollect();
    }

    protected startCountDown(){
        this.stopCountDown();
        this.schedule(this.countDown, 1.0);
        this.countDown();
    }

    public countDown() {
        this.timesLab.string = this._data.cur_times + "/" + this._data.limit;
        var diff = DateUtil.leftTime(this._data.next_time);
        if (diff>0){
            this.cdLab.string = DateUtil.leftTimeStr(this._data.next_time);
            this.collectBtn.interactable = false;
        }else{
            this.cdLab.string = "目前可以征收";
            this.collectBtn.interactable = true;
        }
    }

    public stopCountDown() {
        this.unschedule(this.countDown);
    }

}
