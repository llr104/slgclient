import { _decorator, Component, RichText, Label } from 'cc';
const { ccclass, property } = _decorator;

import GeneralCommand from "../../general/GeneralCommand";
import { WarReportRound } from "./MapUIProxy";

@ccclass('WarReportDesItemLogic')
export default class WarReportDesItemLogic extends Component {

    private _curData:WarReportRound = null;

    @property(RichText)
    warLab1:RichText = null;

    @property(RichText)
    warLab2:RichText = null;

    @property(Label)
    roundsLabel:Label = null;


    protected onLoad():void{

    }


    protected updateItem(data:WarReportRound):void{
        console.log("updateItem:", data);
      
        this._curData = data;
        this.roundsLabel.string = "第" + this._curData.round + "轮/" + this._curData.turn+"回合";

        var att_cfg = GeneralCommand.getInstance().proxy.getGeneralCfg(this._curData.attack.cfgId);
        var def_cfg = GeneralCommand.getInstance().proxy.getGeneralCfg(this._curData.defense.cfgId);

        var title1 = ""
        var title2 = ""
        if(data.isAttack){
            title1 = "攻";
            title2 = "防";
        }else{
            title2 = "攻";
            title1 = "防";
        }
        this.warLab1.string =  "<color=#ff0000>" + title1 + att_cfg.name + "</color>"   + " 对 " 
        + "<color=#00ff00>" + title2 + def_cfg.name +  "</color>" + " 发起攻击，" 
        + "<color=#00ff00>" + title2 + def_cfg.name + "</color>" + " 损失 " + 
        "<color=#F2C420>" + this._curData.defenseLoss + "</color>"  + " 士兵";

        this.warLab2.string =  "<color=#ff0000>" + title2 + def_cfg.name + "</color>"   + " 对 " 
        + "<color=#00ff00>" + title1 + att_cfg.name +  "</color>" + " 发起攻击，" 
        + "<color=#00ff00>" + title1 + att_cfg.name + "</color>" + " 损失 " + 
        "<color=#F2C420>" + this._curData.attackLoss + "</color>"  + " 士兵";

    }

}
