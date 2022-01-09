// // Learn TypeScript:
// //  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// // Learn Attribute:
// //  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// // Learn life-cycle callbacks:
// //  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { _decorator, Component, Label, Button } from 'cc';
const {ccclass, property} = _decorator;

import LoginCommand from "../../login/LoginCommand";
import DateUtil from "../../utils/DateUtil";
import { Tools } from "../../utils/Tools";
import MapUICommand from "./MapUICommand";
import { EventMgr } from '../../utils/EventMgr';

@ccclass('CollectLogic')
export default class CollectLogic extends Component {

    @property(Label)
    cdLab: Label = null;

    @property(Label)
    timesLab: Label = null;

    @property(Label)
    goldLab: Label = null;

    @property(Button)
    collectBtn: Button = null;

    _data: any = null;

    protected onEnable():void{
        console.log("add interior_openCollect");
        EventMgr.on("interior_openCollect", this.onOpenCollect, this);
        EventMgr.on("interior_collect", this.onCollect, this);

        var roleRes = LoginCommand.getInstance().proxy.getRoleResData();
        this.goldLab.string = Tools.numberToShow(roleRes.gold_yield);

        MapUICommand.getInstance().interiorOpenCollect();
    }


    protected onDisable():void{
        EventMgr.targetOff(this);
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
