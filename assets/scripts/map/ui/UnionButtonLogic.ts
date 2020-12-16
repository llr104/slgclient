// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { ArmyData } from "../../general/ArmyProxy";
import GeneralCommand from "../../general/GeneralCommand";
import { GeneralData } from "../../general/GeneralProxy";
import LoginCommand from "../../login/LoginCommand";
import MapUICommand from "./MapUICommand";


const { ccclass, property } = cc._decorator;

@ccclass
export default class WarButtonLogic extends cc.Component {


    @property(cc.Node)
    tipsNode:cc.Node = null;

    protected onLoad():void{
        cc.systemEvent.on("update_union_apply", this.updateView, this);
        cc.systemEvent.on("update_union_apply_push", this.updateViewPush, this)
        this.updateView(0);
    }


    protected updateView(applys):void{
        this.tipsNode.active = applys.length > 0;
    }

    protected updateViewPush(data):void{
        console.log("updateViewPush", data)
        if (data.rid != LoginCommand.getInstance().proxy.getRoleData().rid){
            this.tipsNode.active = true;
        }
    }

    protected onDestroy():void{
        cc.systemEvent.targetOff(this);
    }

    protected onClickClose(): void {
        this.node.active = false;
    }


}
