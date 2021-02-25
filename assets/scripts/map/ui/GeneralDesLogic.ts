// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import GeneralCommand from "../../general/GeneralCommand";
import { GenaralLevelConfig, GeneralData } from "../../general/GeneralProxy";
import { GeneralItemType } from "./GeneralItemLogic";
import SkillIconLogic from "./SkillIconLogic";


const { ccclass, property } = cc._decorator;

@ccclass
export default class GeneralDesLogic extends cc.Component {
  

    @property(cc.Label)
    nameLab: cc.Label = null;

    @property(cc.Layout)
    srollLayout:cc.Layout = null;

    @property(cc.Label)
    lvLabel: cc.Label = null;
    
    @property(cc.Label)
    foreLabel: cc.Label = null;

    @property(cc.Label)
    defenseLabel: cc.Label = null;

    @property(cc.Label)
    speedLabel: cc.Label = null;

    @property(cc.Label)
    strategyLabel: cc.Label = null;

    @property(cc.Label)
    destroyLabel: cc.Label = null;

    @property(cc.Label)
    expLabel: cc.Label = null;

    @property(cc.Label)
    powerLabel: cc.Label = null;

    @property(cc.Label)
    costLabel: cc.Label = null;


    @property(cc.Prefab)
    generalItemPrefab: cc.Prefab = null;

    @property(cc.Node)
    generalItemParent: cc.Node = null;

    private _currData:any = null;
    private _cfgData:any = null;


    private _nameObj:any = {};
    private _addPrObj:any = {};
    private _generalNode:cc.Node = null;

    

    protected onLoad():void{

        this._nameObj = {
            force:"武力",
            strategy:"战略",
            defense:"防御",
            speed:"速度",
            destroy:"破坏",
        };
       
        this._generalNode = cc.instantiate(this.generalItemPrefab);
        this._generalNode.parent = this.generalItemParent;
    }


    public setData(cfgData:any,curData:any):void{
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
     
        var com = this._generalNode.getComponent("GeneralItemLogic");
        if(com){
            com.updateItem(this._currData,GeneralItemType.GeneralNoThing);
        }

        this.powerLabel.string = "体力: " + curData.physical_power + "/" + cfgData.physical_power_limit;
        this.costLabel.string = "cost："+cfgData.cost;
    }

    private getAttrStr(key: string) :string{
        var str = GeneralData.getPrStr(this._cfgData[key], this._addPrObj[key], this._currData.level, this._cfgData[key + "_grow"])
        return this._nameObj[key] + ":" + str;
    }

    protected onClickSkill(event: cc.Event.EventTouch, pos){
        console.log("event", event);
        var node: cc.Node = event.target;
        var isEmpty = node.getComponent(SkillIconLogic).isEmpty();
        // if(isEmpty){
        //     GeneralCommand.getInstance().downSkill(this._currData.id, 201, pos);
        // }else{
        //     GeneralCommand.getInstance().downSkill(this._currData.id, 201, pos);
        // }

        if (pos == 0) {
            GeneralCommand.getInstance().upSkill(this._currData.id, 201, 0);
        }else{
            GeneralCommand.getInstance().downSkill(this._currData.id, 201, 0);
        }
    }


}
