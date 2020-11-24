// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import ArmyCommand from "../../general/ArmyCommand";
import { ArmyData } from "../../general/ArmyProxy";
import GeneralCommand from "../../general/GeneralCommand";
import { GenaralLevelConfig } from "../../general/GeneralProxy";
import LoginCommand from "../../login/LoginCommand";
import MapUICommand from "./MapUICommand";
import { ConscriptBaseCost } from "./MapUIProxy";


const { ccclass, property } = cc._decorator;

@ccclass
export default class ConscriptLogic extends cc.Component {
    @property([cc.Node])
    picNode: cc.Node[] = [];

    private _cityData: any = null;
    private _generalDisposeArr: any = null;
    private _generalArmyArr: number[] = [];
    private _cityArmyData: ArmyData = null;
    private _orderId: number = 0;

    @property(cc.Label)
    costNode: cc.Label = null;


    protected onLoad(): void {
        cc.systemEvent.on("update_army", this.onUpdateArmy, this);
        cc.systemEvent.on("conscript_army_success", this.onClickClose, this);
        
    }


    protected onUpdateArmy(army: ArmyData): void {
        if (army.cityId == this._cityData.cityId && army.order == this._orderId + 1)
            this.setData(this._orderId, this._cityData)
    }

    protected onDestroy(): void {
        cc.systemEvent.targetOff(this);
    }

    protected onClickClose(): void {
        this.node.active = false;
    }

    public setData(orderId: number = 0, cityData: any): void {
        this._generalDisposeArr = [];
        this._generalArmyArr = [];

        this._orderId = orderId;
        this._cityData = cityData;
        this._cityArmyData = ArmyCommand.getInstance().proxy.getArmyByOrder(this._orderId + 1, this._cityData.cityId);

        this._generalDisposeArr[0] = GeneralCommand.getInstance().proxy.getMyGeneral(this._cityArmyData.generals[0]);
        this._generalDisposeArr[1] = GeneralCommand.getInstance().proxy.getMyGeneral(this._cityArmyData.generals[1]);
        this._generalDisposeArr[2] = GeneralCommand.getInstance().proxy.getMyGeneral(this._cityArmyData.generals[2]);


        this._generalArmyArr = this._generalArmyArr.concat(this._cityArmyData.soldiers);
        this.updateView();
    }


    private updateView(): void {
        for (var i = 0; i < this.picNode.length; i++) {
            var item = this.picNode[i];
            item.active = false;
            item.otherData = null;

            var dispiose = this._generalDisposeArr[i];
            var armyNumer = this._generalArmyArr[i];
            if (dispiose) {
                item.active = true;
                var slider = item.getChildByName("New Slider");
                var min = item.getChildByName("MinLabel");
                var max = item.getChildByName("MaxLabel");

                console.log("dispiose.level", dispiose.level)
                var levelCfg: GenaralLevelConfig = GeneralCommand.getInstance().proxy.getGeneralLevelCfg(dispiose.level);
                var maxArmyNumer: number = levelCfg.soldiers;
                console.log("armyNumer:", armyNumer, maxArmyNumer);

                slider.getComponent(cc.Slider).progress = 0;
                slider.getComponent(cc.Slider).maxArmyNumer = maxArmyNumer;
                slider.getComponent(cc.Slider).armyNumer = armyNumer;


                min.getComponent(cc.Label).string = "已征兵:" + armyNumer;
                max.getComponent(cc.Label).string = "最大可征兵:" + maxArmyNumer;

                var pic = item.getChildByName("pic");
                pic.active = true;
                pic.getComponent(cc.Sprite).spriteFrame = GeneralCommand.getInstance().proxy.getGeneralTex(dispiose.cfgId);
                item.otherData = dispiose;
            }
        }

        this.onProgress();
    }





    private onClickConscript(): void {
        var cnt:number[] = this.getCntArr();
        var slider: cc.Node = null;

        ArmyCommand.getInstance().generalConscript(this._cityArmyData.id, cnt, this._cityData);
    }



    private getCntArr():number[]{
        var cnt:number[] = [0,0,0];
        var slider: cc.Node = null;

        for(var i = 0;i < this.picNode.length;i++){
            if(this.picNode[i].active){
                slider = this.picNode[i].getChildByName("New Slider");
                cnt[i] = this.getProgress(slider.getComponent(cc.Slider));
            }
        }
        return cnt.concat();
    }



    private getALLCnt():number{
        var cnt:number[] = this.getCntArr();
        return cnt[0] + cnt[1] + cnt[2];
    }

    private getProgress(data: any): number {
        var baseArmyNumer = data.armyNumer;
        var progress = data.progress;
        var maxArmyNumer = data.maxArmyNumer;
        return parseInt(((maxArmyNumer - baseArmyNumer) * progress) + "");

    }


    private onProgress():void{
        var myRoleRes = LoginCommand.getInstance().proxy.getRoleResData();
        var baseCost:ConscriptBaseCost = MapUICommand.getInstance().proxy.getBaseCost();
        var cnts = this.getALLCnt();
        this.costNode.string = "消耗:  " + "金币:"+ cnts * baseCost.cost_gold + "/" + myRoleRes.gold;
        this.costNode.string += " 木材:"+ cnts * baseCost.cost_wood + "/" + myRoleRes.wood;
        this.costNode.string += " 石材:"+ cnts * baseCost.cost_stone + "/" + myRoleRes.stone;
        this.costNode.string += " 金属:"+ cnts * baseCost.cost_iron + "/" + myRoleRes.iron;
        this.costNode.string += " 谷物:"+ cnts * baseCost.cost_grain + "/" + myRoleRes.grain;
    }

}
