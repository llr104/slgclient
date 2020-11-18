// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { ServerConfig } from "../../config/ServerConfig";
import MapCommand from "../MapCommand";
import MapUICommand from "./MapUICommand";


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
        
        
        this.lvLabel.string = this._currData.level + "/" + this._cfgData.levels.length;
        var str_des = "";
        for(var key in cfgData){
            if(key == "cfgId" || key == "cost"){
                continue;
            }

            if(cfgData[key] > 0){
                str_des += " " + this._nameObj[key] + ": " + cfgData[key];
            }
            
        }
        this.desLabel.string = str_des;
        this.costLabel.string = "花费："+cfgData.cost;
    }



    protected onClickUpFacility(): void {
        var otherData = this._currData;
    }


    protected onEnable():void{
    }


}
