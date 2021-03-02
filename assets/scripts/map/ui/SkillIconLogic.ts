// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { SkillConf } from "../../config/skill/Skill";
import { gSkill } from "../../general/GeneralProxy";
import LoginCommand from "../../login/LoginCommand";
import SkillCommand from "../../skill/SkillCommand";
import { Skill } from "../../skill/SkillProxy";
import DateUtil from "../../utils/DateUtil";
import { Tools } from "../../utils/Tools";
import MapUICommand from "./MapUICommand";

const {ccclass, property} = cc._decorator;

@ccclass
export default class SkillIconLogic extends cc.Component {

    @property([cc.SpriteFrame])
    sps:cc.SpriteFrame[] = [];

    @property(cc.Label)
    lvLab:cc.Label = null;

    _data: Skill = null;

    public setData(data:Skill, gdata:gSkill):void{

        this._data = data;
        if(this._data == null){
            this.getComponent(cc.Sprite).spriteFrame = null;
        }else{
            var conf = SkillCommand.getInstance().proxy.getSkillCfg(data.cfgId);
            if(conf.trigger <= this.sps.length){
                this.getComponent(cc.Sprite).spriteFrame = this.sps[conf.trigger-1];
            }else{
                this.getComponent(cc.Sprite).spriteFrame = null;
            }
        }

        if(gdata){
            if(this.lvLab){
                this.lvLab.string = "lv:" + gdata.lv;
            }
        }else{
            if(this.lvLab){
                this.lvLab.string = "";
            }
        }
    
    }

    public isEmpty():boolean {
        return this._data == null;
    }

    public getSkill():Skill {
        return this._data;
    }

}
