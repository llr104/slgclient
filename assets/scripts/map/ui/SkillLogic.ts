// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import LoginCommand from "../../login/LoginCommand";
import SkillCommand from "../../skill/SkillCommand";
import DateUtil from "../../utils/DateUtil";
import { Tools } from "../../utils/Tools";
import MapUICommand from "./MapUICommand";

const {ccclass, property} = cc._decorator;

@ccclass
export default class SkillLogic extends cc.Component {

    @property(cc.ScrollView)
    scrollView: cc.ScrollView = null;
   
    protected onEnable():void{
        var comp = this.scrollView.node.getComponent("ListLogic");

        var skills = SkillCommand.getInstance().proxy.skills;
        comp.setData(skills);
    }

    protected onClickClose(): void {
        this.node.active = false;
    }

}
