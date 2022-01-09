
import { _decorator, Component, Layout, Node, Label, Slider, Toggle } from 'cc';
const { ccclass, property } = _decorator;
import LoginCommand from "../../login/LoginCommand";
import MapCommand from "../MapCommand";
import MapUICommand from "./MapUICommand";
import { EventMgr } from '../../utils/EventMgr';

@ccclass('TransformLogic')
export default class TransformLogic extends Component {


    @property(Layout)
    fromLayout:Layout = null;


    @property(Layout)
    toLayout:Layout = null;


    @property(Node)
    trNode:Node = null;


    @property(Label)
    trLabel:Label = null;

    @property(Label)
    rateLabel:Label = null;

    
    @property(Slider)
    trSlider:Slider = null;

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

        EventMgr.on("upate_my_roleRes", this.initView, this);
    }

    private getRate() :number {
        var cityId = MapCommand.getInstance().cityProxy.getMyMainCity().cityId;
        var _addition = MapUICommand.getInstance().proxy.getMyCityAddition(cityId);
        var rate = MapUICommand.getInstance().proxy.getTransformRate() + _addition.taxRate;
        return rate
    }

    public initView():void{
        this.updateView();
        this.updateBtn();
        
    }

    protected updateView():void{
        var roleRes = LoginCommand.getInstance().proxy.getRoleResData();
        var i = 0;
        let children_from = this.fromLayout.node.children;
        for (var key in this._nameObj) {
            children_from[i].getChildByName("New Label").getComponent(Label).string = this._nameObj[key] + roleRes[key];
            i++;
        }
        i = 0;
        let children_to = this.toLayout.node.children;
        for (var key in this._nameObj) {
            children_to[i].getChildByName("New Label").getComponent(Label).string = this._nameObj[key] + roleRes[key];
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
            if(children_from[i].getComponent(Toggle).isChecked){
                return i;
            }
        }

        return -1;
    }


    protected getToSelectIndex():number{
        let children_to = this.toLayout.node.children;
        for(var i = 0;i < children_to.length;i++){
            if(children_to[i].getComponent(Toggle).isChecked){
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
        EventMgr.targetOff(this);
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
