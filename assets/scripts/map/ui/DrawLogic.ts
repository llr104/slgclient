
import { _decorator, Component, Label } from 'cc';
const { ccclass, property } = _decorator;

import GeneralCommand from "../../general/GeneralCommand";
import { GeneralCommonConfig } from "../../general/GeneralProxy";
import LoginCommand from "../../login/LoginCommand";
import MapUICommand from "./MapUICommand";
import { EventMgr } from '../../utils/EventMgr';

@ccclass('DrawLogic')
export default class DrawLogic extends Component {


    @property(Label)
    labelOnce: Label = null;

    @property(Label)
    labelTen: Label = null;

    @property(Label)
    cntLab: Label = null;
    

    protected onEnable():void{
        EventMgr.on("upate_my_roleRes", this.updateRoleRes, this);
        EventMgr.on("update_my_generals", this.updateRoleRes, this);
        this.updateRoleRes();
    }


    protected onDisable():void{
        EventMgr.targetOff(this);
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
