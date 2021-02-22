// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html


import GeneralCommand from "../../general/GeneralCommand";
import { WarReportRound } from "./MapUIProxy";


const { ccclass, property } = cc._decorator;

@ccclass
export default class WarReportDesItemLogic extends cc.Component {


    private _curData:WarReportRound = null;


    @property(cc.RichText)
    warLab1:cc.RichText = null;

    @property(cc.RichText)
    warLab2:cc.RichText = null;


    @property(cc.Label)
    roundsLabel:cc.Label = null;


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
