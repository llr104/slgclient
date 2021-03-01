// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { General } from "../../config/Basci";
import { SkillConf } from "../../config/skill/Skill";
import GeneralCommand from "../../general/GeneralCommand";
import { GeneralData } from "../../general/GeneralProxy";
import SkillCommand from "../../skill/SkillCommand";
import { Skill } from "../../skill/SkillProxy";
import SkillInfoLogic from "./SkillInfoLogic";


const {ccclass, property} = cc._decorator;

@ccclass
export default class SkillLogic extends cc.Component {

    @property(cc.ScrollView)
    scrollView: cc.ScrollView = null;

    _general: GeneralData = null;
    _type: number = 0;
    _skillPos : number = -1;


   
    protected onEnable():void{
       
        cc.systemEvent.on("skill_list_info", this.onSkillList, this);
        

        SkillCommand.getInstance().qrySkillList();
    }

    protected onDisable():void {
        cc.systemEvent.targetOff(this)
    }

    protected onSkillList(){
        var skills = SkillCommand.getInstance().proxy.skills;
        var skillConfs = SkillCommand.getInstance().proxy.skillConfs;

        var arr = [];
        for (let i = 0; i < skillConfs.length; i++) {
            var found = false;
            let cfg = skillConfs[i];

            let dSkill = new Skill();
            dSkill.cfgId = cfg.cfgId;
            dSkill.generals = [];

            for (let j = 0; j < skills.length; j++) {
                var skill = skills[j];
                if (skill.cfgId == cfg.cfgId){
                    found = true;
                    arr.push(skill);
                    break
                }
            }
            if(found == false){
                arr.push(dSkill);
            }
        }

        var comp = this.scrollView.node.getComponent("ListLogic");
        comp.setData(arr);
    }

    protected onClickClose(): void {
        this.node.active = false;
    }

    protected onClickItem(data: Skill, target): void {
        cc.systemEvent.emit("open_skillInfo", data, this._type, this._general, this._skillPos);
    }


    /** type:0普通展示、type:1 学习、2:武将查看 **/
    public setData(type:number, general:GeneralData, skillPos: number) {
        this._type = type;
        this._general = general;
        this._skillPos = skillPos;
    }

}
