import { _decorator, Component, Label, Node, SpriteFrame } from 'cc';
const {ccclass, property} = _decorator;
import SkillCommand from "../../skill/SkillCommand";
import { Skill } from "../../skill/SkillProxy";
import SkillIconLogic from "./SkillIconLogic";

@ccclass('SkillItemLogic')
export default class SkillItemLogic extends Component {

   
    @property(Label)
    nameLab: Label = null;

       
    @property(Label)
    limitLab: Label = null;

    @property(Node)
    icon:Node = null;

    @property([SpriteFrame])
    sps:SpriteFrame[] = [];

    _skill: Skill = null;

    protected onEnable():void{
        
    }

    protected updateItem(skill:Skill):void{
   
        var conf = SkillCommand.getInstance().proxy.getSkillCfg(skill.cfgId);
        this._skill = skill;
        this.nameLab.string = conf.name;

        this.icon.getComponent(SkillIconLogic).setData(skill, null);

        this.limitLab.string = this._skill.generals.length + "/" + conf.limit;
    }

}
