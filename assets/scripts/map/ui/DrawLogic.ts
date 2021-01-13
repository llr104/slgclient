// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { ArmyData } from "../../general/ArmyProxy";
import GeneralCommand from "../../general/GeneralCommand";
import { GeneralCommonConfig } from "../../general/GeneralProxy";
import LoginCommand from "../../login/LoginCommand";
import MapUICommand from "./MapUICommand";


const { ccclass, property } = cc._decorator;

@ccclass
export default class DrawLogic extends cc.Component {


    @property(cc.Label)
    labelOnce: cc.Label = null;

    @property(cc.Label)
    labelTen: cc.Label = null;

    @property(cc.Label)
    cntLab: cc.Label = null;
    

    protected onEnable():void{
        cc.systemEvent.on("upate_my_roleRes", this.updateRoleRes, this);
        cc.systemEvent.on("update_my_generals", this.updateRoleRes, this);
        this.updateRoleRes();
    }


    protected onDisable():void{
        cc.systemEvent.targetOff(this);
    }

    protected onClickClose(): void {
        this.node.active = false;
    }


    protected updateRoleRes():void{
        let commonCfg: GeneralCommonConfig = GeneralCommand.getInstance().proxy.getCommonCfg();
        var roleResData = LoginCommand.getInstance().proxy.getRoleResData();
        this.labelOnce.string = "消耗:"+commonCfg.draw_general_cost +"/"+ roleResData.gold;
        this.labelTen.string = "消耗:"+commonCfg.draw_general_cost * 10 +"/"+ roleResData.gold;

        var basic = MapUICommand.getInstance().proxy.getBasicGeneral();
        var cnt = GeneralCommand.getInstance().proxy.getMyActiveGeneralCnt();
        this.cntLab.string = "(" + cnt + "/" + basic.limit + ")";
    }



    protected drawGeneralOnce():void{
        GeneralCommand.getInstance().drawGenerals();
    }

    protected drawGeneralTen():void{
        GeneralCommand.getInstance().drawGenerals(10);
    }



}
