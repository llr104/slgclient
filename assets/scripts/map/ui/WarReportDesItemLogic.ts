// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import GeneralCommand from "../../general/GeneralCommand";
import { GeneralData } from "../../general/GeneralProxy";
import LoginCommand from "../../login/LoginCommand";
import { Role } from "../../login/LoginProxy";
import DateUtil from "../../utils/DateUtil";
import MapUICommand from "./MapUICommand";
import { WarReport, WarReportRound } from "./MapUIProxy";


const { ccclass, property } = cc._decorator;

@ccclass
export default class WarReportDesItemLogic extends cc.Component {


    private _curData:WarReportRound = null;

    @property(cc.Node)
    ackNode:cc.Node = null;


    @property(cc.Node)
    defNode:cc.Node = null;

    @property(cc.Label)
    ackLossLabel:cc.Label = null;

    @property(cc.Label)
    defLossLabel:cc.Label = null;


    @property(cc.Label)
    roundsLabel:cc.Label = null;


    protected onLoad():void{
    }


    protected updateItem(data:any):void{
        this._curData = data;

        this.setTeams(this.ackNode,this._curData.attack)
        this.setTeams(this.defNode,this._curData.defense)

        this.ackLossLabel.string = "损失:" + this._curData.attackLoss +"兵"
        this.defLossLabel.string = "损失:" + this._curData.defenseLoss +"兵"

        this.roundsLabel.string = "第" + this._curData.round + "轮/" + this._curData.turn+"回合"
    }



    protected setTeams(node:cc.Node,generals:any){
        let item:cc.Node = node;
        let com = item.getComponent("GeneralItemLogic");
        var general = generals;
        if(general){
            item.active = true;
            if(com){
                com.setWarReportData(general);
            }

        }else{
            item.active = false;
        }
    }
}
