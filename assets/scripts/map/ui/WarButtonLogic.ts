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


const { ccclass, property } = cc._decorator;

@ccclass
export default class WarButtonLogic extends cc.Component {


    @property(cc.Node)
    tipsNode:cc.Node = null;

    protected onLoad():void{
        cc.systemEvent.on("upate_war_report", this.updateView, this);
        this.updateView();
    }


    protected updateView():void{
        this.tipsNode.active = MapUICommand.getInstance().proxy.isReadNum()>0?true:false;
    }

    protected onDestroy():void{
        cc.systemEvent.targetOff(this);
    }

    protected onClickClose(): void {
        this.node.active = false;
    }


}
