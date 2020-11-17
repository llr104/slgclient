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
export default class FacilityDesLogic extends cc.Component {



    @property(cc.Label)
    titleLabel: cc.Label = null;


    @property(cc.Label)
    desLabel: cc.Label = null;

    @property(cc.Label)
    lvLabel: cc.Label = null;


    @property(cc.Label)
    costLabel: cc.Label = null;


    
    @property(cc.Label)
    upLabel: cc.Label = null;


    @property(cc.Button)
    upButton: cc.Button = null;

    private _currData:any = null;

    private _nameObj:any = {};
    private _upNameObj:any = {};


    protected onLoad():void{
        this._nameObj = {
            decree:"令牌",
            grain:"谷物",
            wood:"木材",
            iron:"金属",
            stone:"石材"
        };


        this._upNameObj = {
            rate:"效益",
            limit:"上限",
            yield:"产量",
            cnt:"数量"
        }


        cc.systemEvent.on("getCityFacilities", this.onCityUpFacilities, this);
    }

    protected onDestroy():void{
        cc.systemEvent.targetOff(this);
    }

    protected onClickClose(): void {
        this.node.active = false;
    }



    protected onCityUpFacilities():void{
        var data = MapUICommand.getInstance().proxy.getMyFacilityByType(this._currData.cityId,this._currData.type);
        if(data){
            data.cityId = this._currData.cityId;
            this.setData(data);
        }
    }

    public setData(data:any):void{
        console.log("setData:",data);
        this._currData = data;
        this.titleLabel.string = data.name;

        var cfgData = MapUICommand.getInstance().proxy.getFacilityCfgByType(data.type);
        if(cfgData){
            console.log("cfgData.json:",cfgData.json)
            this.desLabel.string = cfgData.json.des;
            this.lvLabel.string = this._currData.level + "/" + cfgData.mLevel;

            var nextCost = cfgData.json.levels[this._currData.level];

            this.upButton.node.active = false;
            if(nextCost){

                for(var key in this._upNameObj){
                    if(nextCost[key] != undefined){
                        this.upLabel.string = this._upNameObj[key] + ":" + nextCost[key];
                        break;
                    }
                }


                nextCost = nextCost.need;
                var str = "";
                for(var key in nextCost){
                    if(nextCost[key] > 0){
                        str += " " + this._nameObj[key] + ": " + nextCost[key];
                    }
                    
                }
                this.costLabel.string = str;
                this.upButton.node.active = true;
            }
        }
    }



    protected onClickUpFacility(): void {
        var otherData = this._currData;
        var cityId = MapCommand.getInstance().proxy.getMyMainCity().cityId;
        MapUICommand.getInstance().upFacility(cityId,otherData.type);
    }


    protected onEnable():void{
    }


}
