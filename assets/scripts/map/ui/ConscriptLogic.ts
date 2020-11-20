// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import LoginCommand from "../../login/LoginCommand";
import MapCommand from "../MapCommand";
import MapUICommand from "./MapUICommand";


const { ccclass, property } = cc._decorator;

@ccclass
export default class ConscriptLogic extends cc.Component {



    @property([cc.Node])
    picNode: cc.Node[] = [];

    private _cityData:any = null;
    private _generalDisposeArr:any = null;
    private _generalArmyArr:any = null;
    private _cityArmyData:any = null;
    private _orderId:number = 0;


    protected onLoad():void{
        cc.systemEvent.on("onGeneralDispose", this.onGeneralDispose, this);
    }


    protected onGeneralDispose():void{
        this.setData(this._orderId,this._cityData)
    }

    protected onDestroy():void{
        cc.systemEvent.targetOff(this);
    }

    protected onClickClose(): void {
        this.node.active = false;
    }

    public setData(orderId:number = 0,cityData:any):void{
        this._generalDisposeArr = [];
        this._generalArmyArr = [];

        this._orderId = orderId;
        this._cityData = cityData;
        var cityArmy = MapUICommand.getInstance().proxy.getCityArmy(this._cityData.cityId);
        this._cityArmyData = cityArmy[this._orderId];

        this._generalDisposeArr[0] = MapUICommand.getInstance().proxy.getMyGeneralById(this._cityArmyData.firstId);
        this._generalDisposeArr[1] = MapUICommand.getInstance().proxy.getMyGeneralById(this._cityArmyData.secondId);
        this._generalDisposeArr[2] = MapUICommand.getInstance().proxy.getMyGeneralById(this._cityArmyData.thirdId);


        this._generalArmyArr[0] = this._cityArmyData.first_soldier_cnt;
        this._generalArmyArr[1] = this._cityArmyData.second_soldier_cnt;
        this._generalArmyArr[2] = this._cityArmyData.third_soldier_cnt;


        this.updateView();
    }


    private updateView():void{
        for(var i = 0;i < this.picNode.length;i++){
            var item = this.picNode[i];
            item.active = false;
            item.otherData = null;

            var dispiose = this._generalDisposeArr[i];
            var armyNumer = this._generalArmyArr[i]; 
            if(dispiose){
                item.active = true;
                var slider = item.getChildByName("New Slider");
                var min = item.getChildByName("MinLabel");
                var max = item.getChildByName("MaxLabel");


                var level = dispiose.level;
                var levels = MapUICommand.getInstance().proxy.getGeneralCfgById(dispiose.cfgId).levels; 
                var maxArmyNumer = levels[level - 1].soldiers;
                console.log("armyNumer:",armyNumer,maxArmyNumer);

                slider.getComponent(cc.Slider).progress = 0;
                slider.getComponent(cc.Slider).maxArmyNumer = maxArmyNumer;
                slider.getComponent(cc.Slider).armyNumer = armyNumer;


                min.getComponent(cc.Label).string = armyNumer;
                max.getComponent(cc.Label).string = maxArmyNumer;

                var pic = item.getChildByName("pic");
                pic.active = true;
                pic.getComponent(cc.Sprite).spriteFrame = MapUICommand.getInstance().proxy.getGenTex(dispiose.cfgId);
                item.otherData = dispiose;
            }
        }
    }





    private onClickConscript():void{
        var firstCnt:number = 0;
        var secondCnt:number = 0;
        var thirdCnt:number = 0;
        var slider:cc.Node = null;
        if(this.picNode[0].active){
            slider = this.picNode[0].getChildByName("New Slider");
            firstCnt = this.getProgress(slider.getComponent(cc.Slider));
        }


        if(this.picNode[1].active){
            slider = this.picNode[1].getChildByName("New Slider");
            secondCnt = this.getProgress(slider.getComponent(cc.Slider));
        }


        if(this.picNode[2].active){
            slider = this.picNode[2].getChildByName("New Slider");
            thirdCnt = this.getProgress(slider.getComponent(cc.Slider));
        }

        MapUICommand.getInstance().generalConscript(this._cityArmyData.id,firstCnt,secondCnt,thirdCnt,this._cityData);
    }


    private getProgress(data:any):number{
        var baseArmyNumer = data.armyNumer;
        var progress = data.progress;
        var maxArmyNumer = data.maxArmyNumer;
        return parseInt(((maxArmyNumer - baseArmyNumer) * progress) + "");

    }

}
