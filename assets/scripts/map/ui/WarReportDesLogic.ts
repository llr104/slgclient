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
import { WarReport } from "./MapUIProxy";


const { ccclass, property } = cc._decorator;

@ccclass
export default class WarReportDesLogic extends cc.Component {


    private _curData:WarReport = null;


    @property(cc.ScrollView)
    scrollView:cc.ScrollView = null;

   
    protected onLoad():void{
    }


    protected setData(data:any):void{
        this._curData = data;
        var comp = this.scrollView.node.getComponent("ListLogic");
        comp.setData(this._curData.rounds);

    }


    protected onClickClose(): void {
        this.node.active = false;
    }



}
