import { _decorator, Component, RichText, Label, UITransform, math, Node } from 'cc';
import { AudioManager } from '../../common/AudioManager';
import { SkillEffectType } from '../../config/skill/Skill';
const { ccclass, property } = _decorator;

import GeneralCommand from "../../general/GeneralCommand";
import { GeneralConfig, GeneralData } from '../../general/GeneralProxy';
import SkillCommand from '../../skill/SkillCommand';
import { EventMgr } from '../../utils/EventMgr';
import MapUICommand from './MapUICommand';
import { WarReport, WarReportRound, WarReportSkill } from "./MapUIProxy";


export class GeneralDataX {
    gdata:GeneralData
    gcfg:GeneralConfig
    isAttack:boolean
}

@ccclass('WarReportDesItemLogic')
export default class WarReportDesItemLogic extends Component {

    private _reportRound:WarReportRound = null;

    @property(RichText)
    warLab:RichText = null;

    @property(Label)
    roundsLabel:Label = null;

    @property(Label)
    endLab:Label = null;

    @property(Node)
    cNode:Node = null;

    warReport:WarReport = null;

    attColor:string = "<color=#ff0000>";
    denColor:string = "<color=#00ff00>";
    skillColor:string = "<color=#FD6500>";
    lossColor:string = "<color=#F2C420>"
    endColor:string = "</color>";
    attstr:string = "攻";
    denStr:string = "防";


    public setData(data:WarReportRound, warReport:WarReport, isEnd:boolean):void{

        this._reportRound = data;
        this.warReport = warReport;
        this.endLab.node.active = false;
        this.warLab.string = "";
        this.roundsLabel.string = "第" + this._reportRound.round + "轮/" + this._reportRound.turn+"回合";
 
        //技能
        let str = ""
        for (let i = 0; i < data.attackBefore.length; i++) {
            let b = data.attackBefore[i];
            let gx1 = this.getGeneralX(b.fromId);
            
            let skillCfg = SkillCommand.getInstance().proxy.getSkillCfg(b.cfgId);
            if (gx1.isAttack){
                str += (this.attColor + this.attstr + gx1.gcfg.name + this.endColor)
            }else{
                str += (this.denColor + this.denStr + gx1.gcfg.name + this.endColor)
            }

           
            str += " 使用技能 ";
            str += (this.skillColor + skillCfg.name + "(lv" + b.lv + ") "+ this.endColor);
            str += "作用于 "
            
            for (let j = 0; j < b.toId.length; j++) {
                let to = b.toId[j];
                let gx2 = this.getGeneralX(to);
                
                if(gx2.isAttack){
                    str += (this.attColor + this.attstr + gx2.gcfg.name)
                }else{
                    str += (this.denColor + this.denStr + gx2.gcfg.name)
                }
               
                if(j < b.toId.length-1){
                    str += ","
                    str += this.endColor;
                }else{
                    str += this.endColor;
                    str += " 身上"
                }
            }
            str += this.skillColor
            let estr = this.effectstring(b);
            str += estr;
            str += this.endColor;
            str += this.killstring(b);
           
        }

        this.warLab.string = str;
        
        //伤害
        if(this._reportRound.attack && this._reportRound.defense){
            this.warLab.string += "\n";

            var att_cfg = GeneralCommand.getInstance().proxy.getGeneralCfg(this._reportRound.attack.cfgId);
            var def_cfg = GeneralCommand.getInstance().proxy.getGeneralCfg(this._reportRound.defense.cfgId);
       
            if(data.isAttack){
                this.warLab.string += (this.attColor + this.attstr + att_cfg.name + this.endColor  + " 对 " 
                + this.denColor + this.denStr + def_cfg.name + this.endColor + " 发起攻击，" 
                + this.denColor + this.denStr + def_cfg.name + this.endColor + " 损失 " + 
                this.lossColor + this._reportRound.defenseLoss + this.endColor  + " 士兵");
            }else{
                this.warLab.string += (this.denColor + this.denStr + att_cfg.name + this.endColor  + " 对 " 
                + this.attColor + this.attstr + def_cfg.name + this.endColor + " 发起攻击，" 
                + this.attColor + this.attstr + def_cfg.name + this.endColor + " 损失 " + 
                this.lossColor + this._reportRound.defenseLoss + this.endColor  + " 士兵");
    
               
            }
    
        }
      
        this.cNode.getComponent(UITransform).height = this.warLab.getComponent(UITransform).height;
        if(this.warReport.result == 2){
            if(isEnd){
                this.endLab.node.active = true;
                if(1 == this.warReport.occupy){
                    let str = ("占领了("+ this.warReport.x + "," + this.warReport.y + ")领地");
                    this.endLab.string = str;
                }else{
                    let destroy = this.warReport.destroy_durable / 100;
                    let str = ("对("+ this.warReport.x + "," + this.warReport.y + ")领地造成"+ Math.ceil(destroy) + "破坏");
                    this.endLab.string = str;
                }

                this.cNode.getComponent(UITransform).height = this.warLab.getComponent(UITransform).height + this.endLab.getComponent(UITransform).height + 20;
            }
        }

        this.node.getComponent(UITransform).height = this.cNode.getComponent(UITransform).height + 40;
       
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

        let dengs = this.warReport.beg_defense_general;
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

            if (ie == SkillEffectType.Defense){
                str += ("防御提升" + ev);
            }else if (ie == SkillEffectType.Force){
                str += ("武力提升" + ev);
            }else if (ie == SkillEffectType.Strategy){
                str += ("谋略提升" + ev);
            }else if (ie == SkillEffectType.Speed){
                str += ("速度提升" + ev);
            }else if (ie == SkillEffectType.Destroy){
                str += ("破坏提升" + ev);
            }
            if(er > 0){
                str += ( "持续" + er + "回合");
            }
           
        }
        return str
    }

    private killstring(skill:WarReportSkill):string {
        if(!skill.kill){
            return "";
        }

        let str = "造成"
        for (let i = 0; i < skill.kill.length; i++) {
            let kill = skill.kill[i];
            let to = skill.toId[i];
            let g = this.getGeneralX(to);
            if(g.isAttack){
                str += (this.attColor + this.attstr + g.gcfg.name + this.endColor + "损失" + kill + "士兵")
            }else{
                str += (this.denColor + this.denStr + g.gcfg.name + this.endColor + "损失" + kill + "士兵")
            }
        }
        return str
    }

    protected clickPos() {
        console.log("clickPos");
        AudioManager.instance.playClick();
        EventMgr.emit("close_report");
        EventMgr.emit("scroll_to_map", this.warReport.x, this.warReport.y);
    }

}
