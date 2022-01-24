import { _decorator, Component, RichText, Label, UITransform } from 'cc';
import { SkillEffectType } from '../../config/skill/Skill';
const { ccclass, property } = _decorator;

import GeneralCommand from "../../general/GeneralCommand";
import { GeneralConfig, GeneralData } from '../../general/GeneralProxy';
import SkillCommand from '../../skill/SkillCommand';
import MapUICommand from './MapUICommand';
import { WarReport, WarReportRound, WarReportSkill } from "./MapUIProxy";


export class GeneralDataX {
    gdata:GeneralData
    gcfg:GeneralConfig
    isAttack:boolean
}

@ccclass('WarReportDesItemLogic')
export default class WarReportDesItemLogic extends Component {

    private _curData:WarReportRound = null;

    @property(RichText)
    warLab:RichText = null;

    @property(Label)
    roundsLabel:Label = null;

    warReport:WarReport = null;


    public setData(data:WarReportRound, warReport:WarReport):void{

        this._curData = data;
        this.warReport = warReport;

        this.warLab.string = "";
        this.roundsLabel.string = "第" + this._curData.round + "轮/" + this._curData.turn+"回合";

        let attColor = "<color=#ff0000>";
        let denColor = "<color=#00ff00>";
        let skillColor = "<color=#FD6500>";
        let lossColor = "<color=#F2C420>"
        let endColor = "</color>";

        let attstr = "攻";
        let denStr = "防";
        let lineCnt = data.attackBefore.length + data.attackAfter.length + data.defenseAfter.length+3;

        //技能
        let str = ""
        for (let i = 0; i < data.attackBefore.length; i++) {
            let b = data.attackBefore[i];
            let gx1 = this.getGeneralX(b.fromId);
            
            let skillCfg = SkillCommand.getInstance().proxy.getSkillCfg(b.cfgId);
            if (gx1.isAttack){
                str += (attColor + attstr + gx1.gcfg.name + endColor)
            }else{
                str += (denColor + denStr + gx1.gcfg.name + endColor)
            }

           
            str += " 使用技能 ";
            str += (skillColor + skillCfg.name + "(lv" + b.lv + ") "+ endColor);
            str += "作用于 "
            
            for (let j = 0; j < b.toId.length; j++) {
                let to = b.toId[j];
                let gx2 = this.getGeneralX(to);
                
                if(gx2.isAttack){
                    str += (attColor + attstr + gx2.gcfg.name)
                }else{
                    str += (attColor + denStr + gx2.gcfg.name)
                }
                str += endColor;

                if(j < b.toId.length-1){
                    str += ","
                }else{
                    str += "身上"
                }
            }
            str += skillColor
            let estr = this.effectstring(b);
            str += estr;
            str += endColor;
            
            str += "\n"
        }

        this.warLab.string = str;
        
        //伤害
        var att_cfg = GeneralCommand.getInstance().proxy.getGeneralCfg(this._curData.attack.cfgId);
        var def_cfg = GeneralCommand.getInstance().proxy.getGeneralCfg(this._curData.defense.cfgId);
   
        if(data.isAttack){
            this.warLab.string += (attColor + attstr + att_cfg.name + endColor  + " 对 " 
            + denColor + denStr + def_cfg.name + endColor + " 发起攻击，" 
            + denColor + denStr + def_cfg.name + endColor + " 损失 " + 
            lossColor + this._curData.defenseLoss + endColor  + " 士兵");

            this.warLab.string += "\n";
            
            this.warLab.string += denColor + denStr + def_cfg.name + endColor   + " 对 " 
            + attColor + attstr + att_cfg.name +  endColor + " 发起攻击，" 
            + attColor + attstr + att_cfg.name + endColor + " 损失 " + 
            lossColor + this._curData.attackLoss + endColor  + " 士兵";
        }else{
            this.warLab.string += (denColor + denStr + att_cfg.name + endColor  + " 对 " 
            + attColor + attstr + def_cfg.name + endColor + " 发起攻击，" 
            + attColor + attstr + def_cfg.name + endColor + " 损失 " + 
            lossColor + this._curData.defenseLoss + endColor  + " 士兵");

            this.warLab.string += "\n";
            
            this.warLab.string += attColor + attstr + def_cfg.name + endColor   + " 对 " 
            + denColor + denStr + att_cfg.name +  endColor + " 发起攻击，" 
            + denColor + denStr + att_cfg.name + endColor + " 损失 " + 
            lossColor + this._curData.attackLoss + endColor  + " 士兵";
        }

    
        this.warLab.getComponent(UITransform).height = 40*lineCnt;

        this.node.getComponent(UITransform).height = 40*lineCnt+20;

    }


    private getGeneralX(id:Number):GeneralDataX{
        let gx = new GeneralDataX();
        console.log("getGeneralX:", this.warReport);
        let attgs = this.warReport.beg_attack_general;
        for (let i = 0; i < attgs.length; i++) {
            const g = attgs[i];
            if(g.id == id){
                gx.gdata = g;
                gx.isAttack = true;
                gx.gcfg = GeneralCommand.getInstance().proxy.getGeneralCfg(gx.gdata.cfgId);
                return gx;
            }
        }

        let dengs = this.warReport.beg_attack_general;
        for (let i = 0; i < dengs.length; i++) {
            const g = dengs[i];
            if(g.id == id){
                gx.gdata = g;
                gx.isAttack = false;
                gx.gcfg = GeneralCommand.getInstance().proxy.getGeneralCfg(gx.gdata.cfgId);
                return gx;
            }
        }
    }

    private effectstring(skill:WarReportSkill):string {
        let str = ""
        for (let i = 0; i < skill.includeEffect.length; i++) {
            let ie = skill.includeEffect[i];
            let ev = skill.effectValue[i];
            let er = skill.effectRound[i];
            if(ie == SkillEffectType.HurtRate){
                str += ("伤害率提升" + ev + "%")
            }else if (ie == SkillEffectType.Defense){
                str += ("防御提升" + ev)
            }else if (ie == SkillEffectType.Force){
                str += ("武力提升" + ev)
            }else if (ie == SkillEffectType.Strategy){
                str += ("谋略提升" + ev)
            }else if (ie == SkillEffectType.Speed){
                str += ("速度提升" + ev)
            }else if (ie == SkillEffectType.Destroy){
                str += ("破坏提升" + ev)
            }
           str += ( "持续" + er + "回合")
        }
        return str
    }

}
