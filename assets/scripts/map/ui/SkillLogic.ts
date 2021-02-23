// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { SkillConf } from "../../config/skill/Skill";
import SkillCommand from "../../skill/SkillCommand";
import SkillInfoLogic from "./SkillInfoLogic";


const {ccclass, property} = cc._decorator;

@ccclass
export default class SkillLogic extends cc.Component {

    @property(cc.ScrollView)
    scrollView: cc.ScrollView = null;

    @property(cc.Node)
    skillInfoNode: cc.Node = null;
   
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
        this.skillInfoNode.getComponent(SkillInfoLogic).setData(data);
    }

}
