// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { SkillConf, SkillOutline } from "../../config/skill/Skill";
import GeneralCommand from "../../general/GeneralCommand";
import { GeneralData } from "../../general/GeneralProxy";
import SkillCommand from "../../skill/SkillCommand";
import { Skill } from "../../skill/SkillProxy";
import SkillIconLogic from "./SkillIconLogic";

const {ccclass, property} = cc._decorator;

@ccclass
export default class SkillInfoLogic extends cc.Component {

    @property(cc.Label)
    nameLab: cc.Label = null;

    @property(cc.Node)
    icon:cc.Node = null;

 
    @property(cc.Label)
    lvLab: cc.Label = null;

    @property(cc.Label)
    triggerLab: cc.Label = null;

    @property(cc.Label)
    targetLab: cc.Label = null;

    @property(cc.Label)
    armLab: cc.Label = null;

    @property(cc.Label)
    rateLab: cc.Label = null;

    @property(cc.Label)
    curDesLab: cc.Label = null;

    @property(cc.Label)
    nextDesLab: cc.Label = null;

    @property(cc.Button)
    learnBtn: cc.Button = null;

    @property(cc.Button)
    lvBtn: cc.Button = null;

    @property(cc.Button)
    giveUpBtn: cc.Button = null;

    _data: Skill = null;
    _cfg: SkillConf = null;

    _general: GeneralData = null;
    _type: number = 0;
    _skillPos : number = -1;

    protected onEnable() {
        this.learnBtn.node.active = false;
    }

    protected onClickClose(): void {
        this.node.active = false;
    }

    public setData(data: Skill, type:number, general:GeneralData, skillPos: number) {

        console.log("setData Skill:", data, general);

        var conf = SkillCommand.getInstance().proxy.getSkillCfg(data.cfgId);
        this.icon.getComponent(SkillIconLogic).setData(conf);
        var outLine: SkillOutline = SkillCommand.getInstance().proxy.outLine;

        this._cfg = conf;
        this._data = data;
        this._type = type;
        this._general = general;
        this._skillPos = skillPos;

        this.learnBtn.node.active = type == 1;
        this.giveUpBtn.node.active = type == 2;

        this.nameLab.string = conf.name;

        let isShowLv = false;
        let lv = 0;
        if(type == 2){
            for (let index = 0; index < general.skills.length; index++) {
                const gskill =  general.skills[index];
                if (gskill && gskill.cfgId == data.cfgId && gskill.lv <= conf.levels.length){
                    isShowLv = true;
                    lv = gskill.lv;
                    break
                }
            }
        }

        this.lvBtn.node.active = isShowLv;
        if(isShowLv){
            this.lvLab.string = "lv" + lv;
        }else{
            this.lvLab.string = "";
        }
    
        this.triggerLab.string =  outLine.trigger_type.list[conf.trigger-1].des;
        this.rateLab.string = conf.levels[0].probability + "%";
        this.targetLab.string = outLine.target_type.list[conf.target-1].des;
        this.armLab.string = this.armstr(conf.arms);

        var des1 = conf.des
        for (let index = 0; index < conf.levels[0].effect_value.length; index++) {
            var str = conf.levels[0].effect_value[index] + "";
            des1 = des1.replace("%n%", str);
        }

        this.curDesLab.string = des1;

        var des2 = conf.des
        for (let index = 0; index < conf.levels[1].effect_value.length; index++) {
            var str = conf.levels[1].effect_value[index] + "";
            des2 = des2.replace("%n%", str);
        }

        this.nextDesLab.string = des2;

    }

    protected armstr(arms:number []): string{
        console.log("armstr:", arms);

        var str = ""
        if(arms.indexOf(1)>=0 || arms.indexOf(4)>=0 || arms.indexOf(7)>=0){
            str += "步"
        }

        if(arms.indexOf(2)>=0 || arms.indexOf(5)>=0 || arms.indexOf(8)>=0){
            str += "弓"
        }
        
        if(arms.indexOf(3)>=0 || arms.indexOf(6)>=0 || arms.indexOf(9)>=0){
            str += "骑"
        }
        return str;
    }

    
    protected onClickLearn():void {
        if(this._general){
            GeneralCommand.getInstance().upSkill(this._general.id, this._cfg.cfgId, this._skillPos);
            this.node.active = false;
            cc.systemEvent.emit("close_skill");
        }
    }

    protected onClickLv():void {
        if(this._general){
            GeneralCommand.getInstance().lvSkill(this._general.id, this._skillPos);
            this.node.active = false;
            cc.systemEvent.emit("close_skill");
        }
    }

    protected onClickForget():void {
        if(this._general){
            GeneralCommand.getInstance().downSkill(this._general.id, this._cfg.cfgId, this._skillPos);
            this.node.active = false;
            cc.systemEvent.emit("close_skill");
        }
    }
}
