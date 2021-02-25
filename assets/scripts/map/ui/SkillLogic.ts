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
import SkillInfoLogic from "./SkillInfoLogic";


const {ccclass, property} = cc._decorator;

@ccclass
export default class SkillLogic extends cc.Component {

    @property(cc.ScrollView)
    scrollView: cc.ScrollView = null;

    @property(cc.Node)
    skillInfoNode: cc.Node = null;

    _general: GeneralData = null;
    _type: number = 0;
    _skillPos : number = -1;
   
    protected onEnable():void{
       
        this.skillInfoNode.active = false;
        var comp = this.scrollView.node.getComponent("ListLogic");

        var skills = SkillCommand.getInstance().proxy.skills;
        comp.setData(skills);
    }

    protected onClickClose(): void {
        this.node.active = false;
    }

    protected onClickItem(data: SkillConf, target): void {
        this.skillInfoNode.active = true;
        this.skillInfoNode.getComponent(SkillInfoLogic).setData(data, this._type, this._general, this._skillPos);
    }


    /** type:0普通展示、type:1 学习 **/
    public setData(type:number, general:GeneralData, skillPos: number) {
        this._type = type;
        this._general = general;
        this._skillPos = skillPos;
    }

}
