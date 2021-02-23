// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { SkillConf, SkillOutline } from "../../config/skill/Skill";
import SkillCommand from "../../skill/SkillCommand";

const {ccclass, property} = cc._decorator;

@ccclass
export default class SkillInfoLogic extends cc.Component {

    @property(cc.Label)
    nameLab: cc.Label = null;

    @property(cc.Sprite)
    icon:cc.Sprite = null;

    @property([cc.SpriteFrame])
    sps:cc.SpriteFrame[] = [];

    @property(cc.Label)
    limitLab: cc.Label = null;

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



    protected onClickClose(): void {
        this.node.active = false;
    }

    public setData(data: SkillConf) {
        if(data.trigger < this.sps.length){
            this.icon.spriteFrame = this.sps[data.trigger-1];
        }

        var outLine: SkillOutline = SkillCommand.getInstance().proxy.outLine;
        this.nameLab.string = data.name;
        this.limitLab.string = "0/" + data.limit;
        this.triggerLab.string =  outLine.trigger_type.list[data.trigger-1].des;
        this.rateLab.string = data.levels[0].probability + "%";
        this.targetLab.string = outLine.target_type.list[data.target-1].des;
        this.armLab.string = this.armstr(data.arms);

        var des1 = data.des
        for (let index = 0; index < data.levels[0].effect_value.length; index++) {
            var str = data.include_effect[index] + "";
            des1 = des1.replace("%n%", str);
        }

        this.curDesLab.string = des1;

        var des2 = data.des
        for (let index = 0; index < data.levels[1].effect_value.length; index++) {
            var str = data.include_effect[index] + "";
            des2 = des2.replace("%n%", str);
        }

        this.nextDesLab.string = des2;

    }

    protected armstr(arms:number []): string{
        var str = ""
        if(arms.indexOf(1) || arms.indexOf(4) || arms.indexOf(7)){
            str += "步"
        }else if(arms.indexOf(2) || arms.indexOf(5) || arms.indexOf(8)){
            str += "弓"
        }else if(arms.indexOf(3) || arms.indexOf(6) || arms.indexOf(9)){
            str += "骑"
        }
        return str;
    }


}