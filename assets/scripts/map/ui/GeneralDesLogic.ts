import { _decorator, Component, Label, Layout, Prefab, Node, EventTouch, instantiate } from 'cc';
const { ccclass, property } = _decorator;

import GeneralCommand from "../../general/GeneralCommand";
import {GeneralData } from "../../general/GeneralProxy";
import SkillCommand from "../../skill/SkillCommand";
import GeneralItemLogic, { GeneralItemType } from "./GeneralItemLogic";
import SkillIconLogic from "./SkillIconLogic";
import { EventMgr } from '../../utils/EventMgr';

@ccclass('GeneralDesLogic')
export default class GeneralDesLogic extends Component {
  
    @property(Label)
    nameLab: Label = null;

    @property(Layout)
    srollLayout:Layout = null;

    @property(Label)
    lvLabel: Label = null;
    
    @property(Label)
    foreLabel: Label = null;

    @property(Label)
    defenseLabel: Label = null;

    @property(Label)
    speedLabel: Label = null;

    @property(Label)
    strategyLabel: Label = null;

    @property(Label)
    destroyLabel: Label = null;

    @property(Label)
    expLabel: Label = null;

    @property(Label)
    powerLabel: Label = null;

    @property(Label)
    costLabel: Label = null;


    @property(Prefab)
    generalItemPrefab: Prefab = null;

    @property(Node)
    generalItemParent: Node = null;

    @property([Node])
    skillIcons: Node[] = [];

    @property([Label])
    skillNameLab: Label[] = [];

    private _currData:GeneralData = null;
    private _cfgData:any = null;


    private _nameObj:any = {};
    private _addPrObj:any = {};
    private _generalNode:Node = null;

    protected onEnable(){
        EventMgr.on("update_general", this.updateGeneral, this)
    }

    protected onDisable(){
        EventMgr.targetOff(this);
    }

    protected onLoad():void{

        this._nameObj = {
            force:"武力",
            strategy:"战略",
            defense:"防御",
            speed:"速度",
            destroy:"破坏",
        };
       
        this._generalNode = instantiate(this.generalItemPrefab);
        this._generalNode.parent = this.generalItemParent;
    }

    protected updateGeneral(){
        var data = GeneralCommand.getInstance().proxy.getMyGeneral(this._currData.id);
        if(data){
            this.setData(this._cfgData, data);
        }
    }

    public setData(cfgData:any, curData:GeneralData):void{
        this._currData = curData;
        this._cfgData = cfgData;
    
        var nextCfg = GeneralCommand.getInstance().proxy.getGeneralLevelCfg(this._currData.level + 1);
        var levelExp = nextCfg?nextCfg.exp:"MAX";
        var maxLevel: number = GeneralCommand.getInstance().proxy.getMaxLevel();
        this.lvLabel.string = '等级:' + this._currData.level + "/" + maxLevel;
        this.expLabel.string = "经验:" + curData.exp +"/" + levelExp;
        
        this.nameLab.string = this._cfgData.name;

        this._addPrObj = {
            force:this._currData.force_added,
            strategy:this._currData.strategy_added,
            defense:this._currData.defense_added,
            speed:this._currData.speed_added,
            destroy:this._currData.destroy_added,
        };

       
        this.foreLabel.string = this.getAttrStr("force");
        this.strategyLabel.string = this.getAttrStr("strategy");
        this.defenseLabel.string = this.getAttrStr("defense");
        this.speedLabel.string = this.getAttrStr("speed");
        this.destroyLabel.string = this.getAttrStr("destroy");
     
        var com = this._generalNode.getComponent(GeneralItemLogic);
        if(com){
            com.updateItem(this._currData, GeneralItemType.GeneralNoThing);
        }

        this.powerLabel.string = "体力:" + curData.physical_power + "/" + cfgData.physical_power_limit;
        this.costLabel.string = "cost:"+cfgData.cost;

        for (let index = 0; index < curData.skills.length; index++) {
            let gSkill = curData.skills[index];
            let icon = this.skillIcons[index];
            let iconNameLab = this.skillNameLab[index];

            if(gSkill == null){
                icon.getComponent(SkillIconLogic).setData(null, null);
                iconNameLab.string = "";
            }else{
                
                let skillConf = SkillCommand.getInstance().proxy.getSkillCfg(gSkill.cfgId);
                let skill = SkillCommand.getInstance().proxy.getSkill(gSkill.cfgId);
                if(skillConf && skill){
                    icon.getComponent(SkillIconLogic).setData(skill, gSkill);
                    iconNameLab.string = skillConf.name;
                }else{
                    icon.getComponent(SkillIconLogic).setData(null, null);
                    iconNameLab.string = "";
                }
            }
        }
    }

    private getAttrStr(key: string) :string{
        var str = GeneralData.getPrStr(this._cfgData[key], this._addPrObj[key], this._currData.level, this._cfgData[key + "_grow"])
        return this._nameObj[key] + ":" + str;
    }

    protected onClickSkill(event: EventTouch, pos){
        console.log("event", event, pos);
        var node: Node = event.target;
        var isEmpty = node.getComponent(SkillIconLogic).isEmpty();
        if(isEmpty){
            EventMgr.emit("open_skill", 1, this._currData, pos);
        }else{
            let skill = node.getComponent(SkillIconLogic).getSkill();
            EventMgr.emit("open_skillInfo", skill, 2, this._currData, pos);
        }
    }

}
