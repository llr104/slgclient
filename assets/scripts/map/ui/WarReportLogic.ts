// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { ArmyData } from "../../general/ArmyProxy";
import GeneralCommand from "../../general/GeneralCommand";
import { GeneralData } from "../../general/GeneralProxy";
import MapUICommand from "./MapUICommand";
import { WarReport } from "./MapUIProxy";


const { ccclass, property } = cc._decorator;

@ccclass
export default class WarReportLogic extends cc.Component {

    // @property(cc.Layout)
    // srollLayout:cc.Layout = null;


    @property(cc.ScrollView)
    scrollView:cc.ScrollView = null;

    // @property(cc.Prefab)
    // warPortPrefab: cc.Prefab = null;

    protected onLoad():void{
        cc.systemEvent.on("upate_war_report", this.initView, this);
    }


    protected onDestroy():void{
        cc.systemEvent.targetOff(this);
    }

    protected onClickClose(): void {
        this.node.active = false;
    }


    protected onEnable():void{
        
    }


    protected initView():void{
        var report:WarReport[] = MapUICommand.getInstance().proxy.getWarReport();
        // this.srollLayout.node.removeAllChildren(true);
        // for(var i = 0;i < report.length ;i++){
        //     let item:cc.Node = cc.instantiate(this.warPortPrefab);
        //     item.active = true;
        //     item.parent = this.srollLayout.node;


        //     let com = item.getComponent("WarReportItemLogic");
        //     if(com){
        //         com.setData(report[i]);
        //     }
        // }


        var comp = this.scrollView.node.getComponent("ListLogic");
        comp.setData(report);
    }

    protected updateView():void{
        this.initView();
        MapUICommand.getInstance().qryWarReport();
    }


}
