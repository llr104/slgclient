// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import GeneralCommand from "../../general/GeneralCommand";
import { GeneralConfig, GeneralData } from "../../general/GeneralProxy";
import { GeneralItemType } from "./GeneralItemLogic";

const { ccclass, property } = cc._decorator;

@ccclass
export default class GeneralAddPrLogic  extends cc.Component {


    @property(cc.Prefab)
    generalItemPrefab: cc.Prefab = null;

    @property(cc.Node)
    generalItemParent: cc.Node = null;

    @property(cc.Layout)
    srollLayout:cc.Layout = null;

    @property(cc.Label)
    prLabel: cc.Label = null;


    @property(cc.Node)
    addPr: cc.Node = null;



    private _currData:GeneralData = null;
    private _cfgData:GeneralConfig = null;

    private _generalNode:cc.Node = null;
    private _nameObj:any = {};
    private _addPrObj:any = {};
    private _addPrArr:string[] = [];
    private _canUsePr:number = -1;
    private _step:number = 100;
    protected _curAll:number = 0;

    @property([cc.Node])
    prItems: cc.Node[] = [];

    protected onLoad():void{
        this._generalNode = cc.instantiate(this.generalItemPrefab);
        this._generalNode.parent = this.generalItemParent;

        this._nameObj = {
            force:"力量",
            strategy:"战略",
            defense:"防御",
            speed:"速度",
            destroy:"破坏",
        };

        this._addPrArr = ["force","strategy","defense","speed","destroy"]
    }


    public setData(cfgData:any,curData:any):void{
        console.log("curData:",curData)
        this._canUsePr =-1;
        this._currData = curData;
        this._cfgData = cfgData;
        var com = this._generalNode.getComponent("GeneralItemLogic");
        if(com){
            com.updateItem(this._currData,GeneralItemType.GeneralNoThing);
        }

        this._addPrObj = {
            force:this._currData.force_added,
            strategy:this._currData.strategy_added,
            defense:this._currData.defense_added,
            speed:this._currData.speed_added,
            destroy:this._currData.destroy_added,
        };

        this._curAll = Math.abs(this._currData.hasPrPoint - this._currData.usePrPoint);
        this.updateView();


    }



    protected  updateView():void{
        var children = this.srollLayout.node.children;
        var i = 0;
        for(var key in this._nameObj){
            children[i].getChildByName("New Label").getComponent(cc.Label).string = this._nameObj[key] +":" + ((this._cfgData[key] + this._addPrObj[key])/this._step) 
            +"(+" + this._cfgData[key+"_grow"]/100 +"%)";

            var node:cc.Label = children[i].getChildByName("New Sprite").getChildByName("change Label").getComponent(cc.Label);
            node.string = this._addPrObj[key]/this._step +''
            i++;
        }
        
        

        if(this._canUsePr == -1){
            this._canUsePr = Math.abs(this._currData.hasPrPoint - this._currData.usePrPoint);
        }
        this.prLabel.string = "可用属性点:" + this._canUsePr/this._step + "/" + this._curAll/this._step;


        this.addPr.active = this._currData.hasPrPoint > 0?true:false;
    }

    protected plus(target:any,index:number = 0):void{
        // console.log("plus:",target,index)
        if(!this.isCanePlus()){
            return
        }

        this._addPrObj[this._addPrArr[index]] += this._step;
        this._canUsePr-=this._step
        this.updateView();
    }


    protected reduce(target:any,index:number = 0):void{
        // console.log("reduce:",target,index)
        if(!this.isCaneReduce()){
            return
        }
        var num:number = this._addPrObj[this._addPrArr[index]]
        num = num - this._step;
        num = num < 0?0:num;
        this._addPrObj[this._addPrArr[index]] = num;
        if(num > 0){
            this._canUsePr+=this._step
        }
       
        this.updateView();
    }


    private getAllUse():number{
        var num:number = 0;
        for(var key in this._addPrObj){
            num +=this._addPrObj[key];
        }
        return num
    }


    private isCanePlus():boolean{
        var all:number = this.getAllUse();
        if(all + this._step > this._currData.hasPrPoint){
            return false;
        }
        return true;
    }



    private isCaneReduce():boolean{
        var all:number = this.getAllUse();
        if(all - this._step < 0){
            return false;
        }
        return true;
    }


    protected onClickAddPr():void{
        GeneralCommand.getInstance().addPrGeneral(this._currData.id,this._addPrObj.force,this._addPrObj.strategy,this._addPrObj.defense,this._addPrObj.speed,this._addPrObj.destroy)
    }

}
