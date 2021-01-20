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

    @property(cc.ScrollView)
    scrollView:cc.ScrollView = null;

    @property(cc.Prefab)
    warPortDesPrefab: cc.Prefab = null;
    private _warPortDesNode:cc.Node = null;

    protected onLoad():void{
        cc.systemEvent.on("upate_war_report", this.initView, this);
        cc.systemEvent.on("click_war_report", this.openWarPortDes, this);
    }


    protected onDestroy():void{
        cc.systemEvent.targetOff(this);
    }

    protected onClickClose(): void {
        this.node.active = false;
    }


    protected initView():void{
        var report:WarReport[] = MapUICommand.getInstance().proxy.getWarReport();
        
        var comp = this.scrollView.node.getComponent("ListLogic");
        comp.setData(report);
    }

    public updateView():void{
        this.initView();
        MapUICommand.getInstance().qryWarReport();
    }

    protected openWarPortDes(data:WarReport):void{
        if (this._warPortDesNode == null) {
            this._warPortDesNode = cc.instantiate(this.warPortDesPrefab);
            this._warPortDesNode.parent = this.node;
        } else {
            this._warPortDesNode.active = true;
        }

        this._warPortDesNode.getComponent("WarReportDesLogic").setData(data);
    }

    protected allRead():void{
        MapUICommand.getInstance().warRead(0);
    }
}
