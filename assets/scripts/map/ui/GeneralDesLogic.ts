// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import GeneralCommand from "../../general/GeneralCommand";
import { GenaralLevelConfig } from "../../general/GeneralProxy";


const { ccclass, property } = cc._decorator;

@ccclass
export default class GeneralDesLogic extends cc.Component {



    @property(cc.Label)
    titleLabel: cc.Label = null;


    @property(cc.Label)
    lvLabel: cc.Label = null;


    @property(cc.Label)
    costLabel: cc.Label = null;


    
    @property(cc.Label)
    desLabel: cc.Label = null;


    private _currData:any = null;
    private _cfgData:any = null;

    private _nameObj:any = {};


    protected onLoad():void{
        this._nameObj = {
            force:"力量",
            strategy:"战略",
            defense:"防御",
            speed:"速度",
            destroy:"破坏",
            exp:"经验",
            physical_power:"体力"
        };




    }

    protected onDestroy():void{
        cc.systemEvent.targetOff(this);
    }

    protected onClickClose(): void {
        this.node.active = false;
    }



    public setData(cfgData:any,curData:any):void{
        console.log("setData:",cfgData,curData);
        this._currData = curData;
        this._cfgData = cfgData;
        this.titleLabel.string = curData.name;
    
        var maxLevel: number = GeneralCommand.getInstance().proxy.getMaxLevel();
        this.lvLabel.string = '等级:' +this._currData.level + "/" + maxLevel;
        var str_des = "";
        for(var key in cfgData){
            if(key == "cfgId" || key == "cost"){
                continue;
            }            
        }



        // if(cfgData[key] > 0){
            
        // }


        str_des = this._nameObj.force + ": " + cfgData.force/100 + "(+" + curData.force_grow/100 + "%)";
        str_des += " " + this._nameObj.strategy + ": " + cfgData.strategy/100 + "(+" + curData.strategy_grow/100 + "%)";
        str_des += " " + this._nameObj.defense + ": " + cfgData.defense/100 + "(+" + curData.defense_grow/100 + "%)";
        str_des += " " + this._nameObj.speed + ": " + cfgData.speed/100 + "(+" + curData.speed_grow/100 + "%)";
        str_des += " " + this._nameObj.destroy + ": " + cfgData.destroy/100 + "(+" + curData.destroy_grow/100 + "%)";
        str_des += " " + this._nameObj.exp + ": " + curData.exp;
        str_des += " " + this._nameObj.physical_power + ": " + curData.physical_power;

        this.desLabel.string = str_des;
        this.costLabel.string = "花费："+cfgData.cost;
    }



    protected onClickUpGeneral(): void {
        var otherData = this._currData;
    }


    protected onEnable():void{
    }


}
