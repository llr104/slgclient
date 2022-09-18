import { _decorator, Component, RichText, Label, UITransform, math, Node } from 'cc';
import { AudioManager } from '../../common/AudioManager';
import { LogicEvent } from '../../common/LogicEvent';
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
        let str = this.skillString(data.attackBefore);
        this.warLab.string = str;
        
        //伤害
        if(this._reportRound.attack && this._reportRound.defense){
            this.warLab.string += "\n";

            var att_cfg = GeneralCommand.getInstance().proxy.getGeneralCfg(this._reportRound.attack.cfgId);
            var def_cfg = GeneralCommand.getInstance().proxy.getGeneralCfg(this._reportRound.defense.cfgId);
       
            if(data.isAttack){
                let aName = this.nameString(true, att_cfg, this._reportRound.attack);
                let bName = this.nameString(false, def_cfg, this._reportRound.defense);

                this.warLab.string += (this.attColor + aName + this.endColor  + " 对 " 
                + this.denColor +  bName + this.endColor + 
                " 发起攻击，" + this.denColor + bName + this.endColor + " 损失 " + 
                this.lossColor + this._reportRound.defenseLoss + this.endColor  + " 士兵");
            }else{
                let bName = this.nameString(true, att_cfg, this._reportRound.attack);
                let aName = this.nameString(false, def_cfg, this._reportRound.defense);

                this.warLab.string += (this.denColor + aName + this.endColor  + " 对 " 
                + this.attColor + bName + this.endColor + " 发起攻击，" 
                + this.attColor + bName + this.endColor + " 损失 " + 
                this.lossColor + this._reportRound.defenseLoss + this.endColor  + " 士兵");
            }
    
        }

        if(data.attackAfter.length > 0){
            this.warLab.string += "\n";
            let str = this.skillString(data.attackAfter);
            this.warLab.string += str;
        }
        
        
        if(data.defenseAfter.length > 0){
            this.warLab.string += "\n";
            let str = this.skillString(data.defenseAfter);
            this.warLab.string += str;
        }
      
        this.cNode.getComponent(UITransform).height = this.warLab.getComponent(UITransform).height;
        if(isEnd){
            this.endLab.node.active = true;
            this.endLab.string = "";
            if (this.warReport.result == 0){
                let str = "我方主将兵力被消耗殆尽，战斗失败";
                this.endLab.string = str;
            }else if(this.warReport.result == 1){
                let str = "战斗不分胜负，打平";
                this.endLab.string = str;
            }else if(this.warReport.result == 2){
                let str = "对方主将兵力被消耗殆尽，";
                if(1 == this.warReport.occupy){
                    str += ("我方占领了("+ this.warReport.x + "," + this.warReport.y + ")领地");
                    this.endLab.string = str;
                }else{
                    let destroy = this.warReport.destroy_durable / 100;
                    str += ("对("+ this.warReport.x + "," + this.warReport.y + ")领地造成"+ Math.ceil(destroy) + "破坏");
                    this.endLab.string = str;
                }
            }
            
            this.cNode.getComponent(UITransform).height = this.warLab.getComponent(UITransform).height + this.endLab.getComponent(UITransform).height + 20;
        }
       

        this.node.getComponent(UITransform).height = this.cNode.getComponent(UITransform).height + 40;
       
    }


    private getGeneralX(id:Number):GeneralDataX{
        let gx = new GeneralDataX();
        // console.log("getGeneralX:", this.warReport);
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

    private skillString(skills:WarReportSkill[]):string {
        let str = "";
        for (let i = 0; i < skills.length; i++) {
            let b = skills[i];
            let gx1 = this.getGeneralX(b.fromId);
            
            let skillCfg = SkillCommand.getInstance().proxy.getSkillCfg(b.cfgId);
            if (gx1.isAttack){
                str += (this.attColor + this.nameString(true, gx1.gcfg, gx1.gdata) + this.endColor)
            }else{
                str += (this.denColor + this.nameString(false, gx1.gcfg, gx1.gdata) + this.endColor)
            }

           
            str += " 使用技能 ";
            str += (this.skillColor + skillCfg.name + "(lv" + b.lv + ") "+ this.endColor);
            str += "作用于 "
            
            for (let j = 0; j < b.toId.length; j++) {
                let to = b.toId[j];
                let gx2 = this.getGeneralX(to);
                
                if(gx2.isAttack){
                    str += (this.attColor + this.nameString(true, gx2.gcfg, gx2.gdata));
                }else{
                    str += (this.denColor + this.nameString(false, gx2.gcfg, gx2.gdata));
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
            let estr = this.effectString(b);
            str += estr;
            str += this.endColor;
            str += this.killString(b);
           
        }

        return str;
    }

    private effectString(skill:WarReportSkill):string {
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

    private killString(skill:WarReportSkill):string {
        if(!skill.kill){
            return "";
        }

        let str = "造成"
        for (let i = 0; i < skill.kill.length; i++) {
            let kill = skill.kill[i];
            let to = skill.toId[i];
            let g = this.getGeneralX(to);
            if(g.isAttack){
                str += (this.attColor + " " + this.nameString(true, g.gcfg, g.gdata) + " "  + this.endColor + "损失" + kill + "士兵")
            }else{
                str += (this.denColor + " " + this.nameString(false, g.gcfg, g.gdata) + " "  + this.endColor + "损失" + kill + "士兵")
            }
        }
        return str
    }

    private nameString(isAttack:boolean, cfg:GeneralConfig, general:any) {
        if(isAttack){
            let position = -1;
            for (let index = 0; index < this.warReport.beg_attack_general.length; index++) {
                const g = this.warReport.beg_attack_general[index];
                if(g.id == general.id){
                    position = index;
                    break;
                }
            }
            return this.attstr + cfg.name + "(" + this.positionString(position) + ")"
        }else{
            let position = -1;
            for (let index = 0; index < this.warReport.beg_attack_general.length; index++) {
                const g = this.warReport.beg_defense_general[index];
                if(g.id == general.id){
                    position = index;
                    break;
                }
            }

            return this.denStr + cfg.name + "(" + this.positionString(position) + ")"
        }
    }

    private positionString(position:number) {
        if(position == 0){
            return "主将";
        }else{
            return "副将";
        }
    }

    protected clickPos() {
        console.log("clickPos");
        AudioManager.instance.playClick();
        EventMgr.emit(LogicEvent.closeReport);
        EventMgr.emit(LogicEvent.scrollToMap, this.warReport.x, this.warReport.y);
    }

}
