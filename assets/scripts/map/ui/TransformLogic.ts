// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { ArmyData } from "../../general/ArmyProxy";
import GeneralCommand from "../../general/GeneralCommand";
import { GeneralCommonConfig } from "../../general/GeneralProxy";
import LoginCommand from "../../login/LoginCommand";
import MapCommand from "../MapCommand";
import MapUICommand from "./MapUICommand";


const { ccclass, property } = cc._decorator;

@ccclass
export default class TransformLogic extends cc.Component {


    @property(cc.Layout)
    fromLayout:cc.Layout = null;


    @property(cc.Layout)
    toLayout:cc.Layout = null;


    @property(cc.Node)
    trNode:cc.Node = null;


    @property(cc.Label)
    trLabel:cc.Label = null;

    @property(cc.Label)
    rateLabel:cc.Label = null;

    
    @property(cc.Slider)
    trSlider:cc.Slider = null;

    protected _nameObj: any = {};
    protected _keyArr:string[] = []
    protected _curFromIndex:number = -1;
    protected _curToIndex:number = -1;
    protected _fromChange:number = 0;
    protected _toChange:number = 0;

    protected onLoad():void{
        
        this._nameObj = {
            wood: "木材x",
            iron: "金属x",
            stone: "石材x",
            grain: "谷物x",
        };

        this._keyArr = ["wood","iron","stone","grain"]

        // cc.systemEvent.on("upate_my_roleRes", this.updateView, this);
    }

    private getRate() :number {
        var cityId = MapCommand.getInstance().cityProxy.getMyMainCity().cityId;
        var _addition = MapUICommand.getInstance().proxy.getMyCityAddition(cityId);
        var rate = MapUICommand.getInstance().proxy.bTransformRate + _addition.taxRate;
        return rate
    }

    protected initView():void{
        this.updateView();
        this.updateBtn();
        
    }

    protected updateView():void{
        var roleRes = LoginCommand.getInstance().proxy.getRoleResData();
        var i = 0;
        let children_from = this.fromLayout.node.children;
        for (var key in this._nameObj) {
            children_from[i].getChildByName("New Label").getComponent(cc.Label).string = this._nameObj[key] + roleRes[key];
            i++;
        }
        i = 0;
        let children_to = this.toLayout.node.children;
        for (var key in this._nameObj) {
            children_to[i].getChildByName("New Label").getComponent(cc.Label).string = this._nameObj[key] + roleRes[key];
            i++;
        }

        var rate = this.getRate()
        this.rateLabel.string = "1 / " + (rate/100)

    }

    protected updateBtn():void{
        this.trSlider.progress = 0.0;
        this.trNode.active = this._curFromIndex == this._curToIndex?false:true;
        this.updateLable();
    }


    protected updateLable():void{
        var from_index = this.getFromSelectIndex();
        var to_index = this.getToSelectIndex();
        if (from_index < 0 || to_index < 0){
            this.trLabel.string = ""
        }else{
            var roleRes = LoginCommand.getInstance().proxy.getRoleResData();
            var from_key = this._keyArr[from_index];
            this._fromChange = Math.round(roleRes[from_key] * this.trSlider.progress)
            
            var rate = this.getRate()
            this._toChange = Math.round(this._fromChange * rate / 100)
            this.trLabel.string = this._fromChange  + "/" + this._toChange
        }
    }

    protected getFromSelectIndex():number{
        let children_from = this.fromLayout.node.children;
        for(var i = 0;i < children_from.length;i++){
            if(children_from[i].getComponent(cc.Toggle).isChecked){
                return i;
            }
        }

        return -1;
    }


    protected getToSelectIndex():number{
        let children_to = this.toLayout.node.children;
        for(var i = 0;i < children_to.length;i++){
            if(children_to[i].getComponent(cc.Toggle).isChecked){
                return i;
            }
        }

        return -1;
    }


    protected fromToggleHandle(event:any):void{
        console.log("fromToggleHandle:",this.getFromSelectIndex())
        this._curFromIndex = this.getFromSelectIndex();
        this.updateBtn();
    }

    protected toToggleHandle(event:any):void{
        console.log("toToggleHandle:",this.getToSelectIndex())
        this._curToIndex = this.getToSelectIndex()
        this.updateBtn();
    }


    protected slideHandle():void{
        this.updateLable();
    }

    protected onDestroy():void{
        cc.systemEvent.targetOff(this);
    }

    protected onClickClose(): void {
        this.node.active = false;
    }

    protected onTransForm():void{
        let from:number[] = [0,0,0,0];
        let to:number[] = [0,0,0,0];

        var from_index = this.getFromSelectIndex();
        var to_index = this.getToSelectIndex();

        if(from_index < 0 || to_index < 0){
            return
        }

        from[from_index] = this._fromChange;
        to[to_index] = this._toChange;

        MapUICommand.getInstance().interiorTransform(from,to);
    }

}
