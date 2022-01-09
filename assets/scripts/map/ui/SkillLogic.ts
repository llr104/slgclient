import { _decorator, Component, ScrollView } from 'cc';
const {ccclass, property} = _decorator;

import { General } from "../../config/Basci";
import { SkillConf } from "../../config/skill/Skill";
import GeneralCommand from "../../general/GeneralCommand";
import { GeneralData } from "../../general/GeneralProxy";
import SkillCommand from "../../skill/SkillCommand";
import { Skill } from "../../skill/SkillProxy";
import SkillInfoLogic from "./SkillInfoLogic";
import { EventMgr } from '../../utils/EventMgr';

@ccclass('SkillLogic')
export default class SkillLogic extends Component {

    @property(ScrollView)
    scrollView: ScrollView = null;

    _general: GeneralData = null;
    _type: number = 0;
    _skillPos : number = -1;


   
    protected onEnable():void{
       
        EventMgr.on("skill_list_info", this.onSkillList, this);
        SkillCommand.getInstance().qrySkillList();
    }

    protected onDisable():void {
        EventMgr.targetOff(this)
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
        EventMgr.emit("open_skillInfo", data, this._type, this._general, this._skillPos);
    }


    /** type:0普通展示、type:1 学习、2:武将查看 **/
    public setData(type:number, general:GeneralData, skillPos: number) {
        this._type = type;
        this._general = general;
        this._skillPos = skillPos;
    }

}
