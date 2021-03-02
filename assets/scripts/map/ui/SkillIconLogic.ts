// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { SkillConf } from "../../config/skill/Skill";
import LoginCommand from "../../login/LoginCommand";
import DateUtil from "../../utils/DateUtil";
import { Tools } from "../../utils/Tools";
import MapUICommand from "./MapUICommand";

const {ccclass, property} = cc._decorator;

@ccclass
export default class SkillIconLogic extends cc.Component {

    @property([cc.SpriteFrame])
    sps:cc.SpriteFrame[] = [];

    _conf: SkillConf = null;

    public setData(conf:SkillConf):void{

        // console.log("setData SkillConf:", conf);

        this._conf = conf;
        if(this._conf == null){
            this.getComponent(cc.Sprite).spriteFrame = null;
        }else{
            if(conf.trigger <= this.sps.length){
                this.getComponent(cc.Sprite).spriteFrame = this.sps[conf.trigger-1];
            }else{
                this.getComponent(cc.Sprite).spriteFrame = null;
            }
        }
    
    }

    public isEmpty():boolean {
        return this._conf == null;
    }

    public getCnf():SkillConf {
        return this._conf;
    }

}
