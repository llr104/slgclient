
import { _decorator, Component, Label, Prefab, Node, Layout, instantiate } from 'cc';
const { ccclass, property } = _decorator;

import GeneralCommand from "../../general/GeneralCommand";
import { GeneralConfig, GeneralData } from "../../general/GeneralProxy";
import GeneralItemLogic, { GeneralItemType } from "./GeneralItemLogic";

@ccclass('GeneralAddPrLogic')
export default class GeneralAddPrLogic  extends Component {

    @property(Label)
    nameLab: Label = null;

    @property(Prefab)
    generalItemPrefab: Prefab = null;

    @property(Node)
    generalItemParent: Node = null;

    @property(Layout)
    srollLayout:Layout = null;

    @property(Label)
    prLabel: Label = null;


    @property(Node)
    addPr: Node = null;



    private _currData:GeneralData = null;
    private _cfgData:GeneralConfig = null;

    private _generalNode:Node = null;
    private _nameObj:any = {};
    private _addPrObj:any = {};
    private _addPrArr:string[] = [];
    private _canUsePr:number = -1;
    private _step:number = 100;
    protected _curAll:number = 0;

    @property([Node])
    prItems: Node[] = [];

    protected onLoad():void{
        this._generalNode = instantiate(this.generalItemPrefab);
        this._generalNode.parent = this.generalItemParent;

        this._nameObj = {
            force:"武力",
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
        this.nameLab.string = this._cfgData.name;
        
        var com = this._generalNode.getComponent(GeneralItemLogic);
        if(com){
            com.updateItem(this._currData, GeneralItemType.GeneralNoThing);
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
            children[i].getChildByName("New Label").getComponent(Label).string = this._nameObj[key] +":" + 
            GeneralData.getPrStr(this._cfgData[key],this._addPrObj[key],this._currData.level,this._cfgData[key+"_grow"]);

            var node:Label = children[i].getChildByName("New Sprite").getChildByName("change Label").getComponent(Label);
            node.string = this._addPrObj[key]/this._step +''
            i++;
        }
        
        

        if(this._canUsePr == -1){
            this._canUsePr = Math.abs(this._currData.hasPrPoint - this._currData.usePrPoint);
        }
        this.prLabel.string = "可用属性点:" + this._canUsePr/this._step + "/" + this._currData.hasPrPoint/this._step;
        this.addPr.active = this._currData.hasPrPoint > 0?true:false;
    }

    protected plus(target:any,index:number = 0):void{
        var num:number = this._addPrObj[this._addPrArr[index]]
        if(!this.isCanePlus() || num >= this._currData.hasPrPoint){
            return
        }

        num = num + this._step;
        num = num > this._currData.hasPrPoint?this._currData.hasPrPoint:num;
        this._addPrObj[this._addPrArr[index]] = num;
        this._canUsePr -= this._step
        this.updateView();
    }


    protected reduce(target:any,index:number = 0):void{
        var num:number = this._addPrObj[this._addPrArr[index]]
        if(!this.isCaneReduce() || num == 0){
            return
        }
        
        num = num - this._step;
        num = num < 0?0:num;
        this._addPrObj[this._addPrArr[index]] = num;
        this._canUsePr += this._step
       
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
        GeneralCommand.getInstance().addPrGeneral(
            this._currData.id, 
            this._addPrObj.force, 
            this._addPrObj.strategy, 
            this._addPrObj.defense, 
            this._addPrObj.speed, 
            this._addPrObj.destroy);
    }

}
