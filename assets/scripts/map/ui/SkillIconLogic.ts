import { _decorator, Component, SpriteFrame, Label, Sprite } from 'cc';
const {ccclass, property} = _decorator;


import { gSkill } from "../../general/GeneralProxy";
import SkillCommand from "../../skill/SkillCommand";
import { Skill } from "../../skill/SkillProxy";


@ccclass('SkillIconLogic')
export default class SkillIconLogic extends Component {

    @property([SpriteFrame])
    sps:SpriteFrame[] = [];

    @property(Label)
    lvLab:Label = null;

    _data: Skill = null;

    public setData(data:Skill, gdata:gSkill):void{

        this._data = data;
        if(this._data == null){
            this.getComponent(Sprite).spriteFrame = null;
        }else{
            var conf = SkillCommand.getInstance().proxy.getSkillCfg(data.cfgId);
            if(conf.trigger <= this.sps.length){
                this.getComponent(Sprite).spriteFrame = this.sps[conf.trigger-1];
            }else{
                this.getComponent(Sprite).spriteFrame = null;
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
