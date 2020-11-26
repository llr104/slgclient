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

    @property(cc.Layout)
    srollLayout:cc.Layout = null;

    @property(cc.Label)
    powerLabel: cc.Label = null;

    @property(cc.Sprite)
    spritePic:cc.Sprite = null;

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
        this.titleLabel.string = cfgData.name;
    
        var levelExp = GeneralCommand.getInstance().proxy.getGeneralLevelCfg(this._currData.level + 1).exp;
        var maxLevel: number = GeneralCommand.getInstance().proxy.getMaxLevel();
        this.lvLabel.string = '等级:' +this._currData.level + "/" + maxLevel + "   经验:"+curData.exp +"/" + levelExp;
        




        var children = this.srollLayout.node.children;
        var i = 0;
        for(var key in this._nameObj){
            children[i].getChildByName("New Label").getComponent(cc.Label).string = this._nameObj[key] +":" + cfgData[key]/100 
            +"(+" + cfgData[key+"_grow"]/100 +"%)";
            i++;

        }

        this.spritePic.spriteFrame = GeneralCommand.getInstance().proxy.getGeneralTex(cfgData.cfgId);

        this.powerLabel.string = "体力: " + curData.physical_power + "/" + cfgData.physical_power_limit;
        this.costLabel.string = "花费："+cfgData.cost;
    }



    protected onClickUpGeneral(): void {
        var otherData = this._currData;
    }


    protected onEnable():void{
    }


}
