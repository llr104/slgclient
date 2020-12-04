// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import GeneralCommand from "../../general/GeneralCommand";
import { GenaralLevelConfig } from "../../general/GeneralProxy";
import { GeneralItemType } from "./GeneralItemLogic";


const { ccclass, property } = cc._decorator;

@ccclass
export default class GeneralDesLogic extends cc.Component {
    @property(cc.Label)
    lvLabel: cc.Label = null;

    @property(cc.Label)
    costLabel: cc.Label = null;

    @property(cc.Layout)
    srollLayout:cc.Layout = null;

    @property(cc.Label)
    powerLabel: cc.Label = null;

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
            force:"力量",
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
        this.lvLabel.string = '等级:' +this._currData.level + "/" + maxLevel + "   经验:"+curData.exp +"/" + levelExp;
        


        this._addPrObj = {
            force:this._currData.force_added,
            strategy:this._currData.strategy_added,
            defense:this._currData.defense_added,
            speed:this._currData.speed_added,
            destroy:this._currData.destroy_added,
        };

        var children = this.srollLayout.node.children;
        var i = 0;
        for(var key in this._nameObj){
            children[i].getChildByName("New Label").getComponent(cc.Label).string = this._nameObj[key] +":" + (cfgData[key] + this._addPrObj[key])/100 
            +"(+" + cfgData[key+"_grow"]/100 +"%)";
            i++;

        }

        var com = this._generalNode.getComponent("GeneralItemLogic");
        if(com){
            com.updateItem(this._currData,GeneralItemType.GeneralNoThing);
        }

        this.powerLabel.string = "体力: " + curData.physical_power + "/" + cfgData.physical_power_limit;
        this.costLabel.string = "cost："+cfgData.cost;
    }


    // protected openGeneralCcompose():void{
    //     cc.systemEvent.emit("open_general_compose", this._cfgData,this._currData);
    // }



}
