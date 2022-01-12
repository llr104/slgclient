
import { _decorator, Component, Label, Sprite, Layout, Node, color } from 'cc';
const { ccclass, property } = _decorator;

import GeneralCommand from "../../general/GeneralCommand";
import { GeneralCampType, GeneralData } from "../../general/GeneralProxy";
import GeneralHeadLogic from "./GeneralHeadLogic";
import { EventMgr } from '../../utils/EventMgr';

// /**军队命令*/
export class GeneralItemType {
    static GeneralInfo: number = 0;//武将详情
    static GeneralDispose: number = 1;//武将上阵
    static GeneralConScript: number = 2;//武将征兵
    static GeneralNoThing: number = 3;//无用
    static GeneralSelect: number = 4;//选择
}


@ccclass('GeneralItemLogic')
export default class GeneralItemLogic extends Component {

    @property(Label)
    nameLabel: Label = null;

    @property(Label)
    lvLabel: Label = null;

    @property(Sprite)
    spritePic:Sprite = null;

    @property(Label)
    costLabel: Label = null;

    @property(Label)
    campLabel: Label = null;

    @property(Label)
    armLabel: Label = null;
    
    @property(Layout)
    starLayout:Layout = null;

    @property(Node)
    delNode:Node = null;

    @property(Node)
    useNode:Node = null;


    @property(Node)
    selectNode:Node = null;

    private _curData:any = null;
    private _type:number = -1;
    private _position:number = 0;
    private _cityData:any = null;
    private _orderId:number = 1;
    private _isSelect:boolean = false;

    protected onLoad():void{
        this.delNode.active = false;
        this._isSelect = false;
    }


    public setData(curData:GeneralData,type:number = 0,position:number = 0):void{
        this.updateItem(curData);
    }



    public updateItem(curData:any):void{
        this.updateView(curData);
        this._type = this._curData.type == undefined?-1:this._curData.type;
        this._position = this._curData.position == undefined?0:this._curData.position;
    }


    protected updateView(curData:any):void{
        this._curData = curData;

        var cfgData = GeneralCommand.getInstance().proxy.getGeneralCfg(this._curData.cfgId);
        this.nameLabel.string = cfgData.name 
        this.lvLabel.string = " Lv." +  this._curData.level ;
        this.spritePic.getComponent(GeneralHeadLogic).setHeadId(this._curData.cfgId);
        this.showStar(cfgData.star,this._curData.star_lv);
        this.delNode.active = false;

        if(cfgData.camp == GeneralCampType.Han){
            this.campLabel.string = "汉";
        }else if(cfgData.camp == GeneralCampType.Qun){
            this.campLabel.string = "群";
        }else if(cfgData.camp == GeneralCampType.Wei){
            this.campLabel.string = "魏";
        }else if(cfgData.camp == GeneralCampType.Shu){
            this.campLabel.string = "蜀";
        }else if(cfgData.camp == GeneralCampType.Wu){
            this.campLabel.string = "吴";
        }
        
        this.armLabel.string = this.armstr(cfgData.arms);

        if(this.useNode){
            if(this._type == GeneralItemType.GeneralInfo && this._curData.order > 0){
                this.useNode.active = true;
            }else{
                this.useNode.active = false; 
            }
        }

        if(this.costLabel){
            this.costLabel.string = cfgData.cost + "";
        }
        this.select(false);
    }

    protected armstr(arms:number []): string{
        // console.log("armstr:", arms);

        var str = ""
        if(arms.indexOf(1)>=0 || arms.indexOf(4)>=0 || arms.indexOf(7)>=0){
            str += "步"
        }else if(arms.indexOf(2)>=0 || arms.indexOf(5)>=0 || arms.indexOf(8)>=0){
            str += "弓"
        }else if(arms.indexOf(3)>=0 || arms.indexOf(6)>=0 || arms.indexOf(9)>=0){
            str += "骑"
        }
        return str;
    }


    public select(flag:boolean):void{
        if(this.selectNode){
            this.selectNode.active = flag;
        }
        this._isSelect = flag;
    }


    protected showStar(star:number = 3,star_lv:number = 0):void{
        var childen = this.starLayout.node.children;
        for(var i = 0;i<childen.length;i++){
            if(i < star){
                childen[i].active = true;
                if(i < star_lv){
                    childen[i].getComponent(Sprite).color = color(255,0,0);
                }else{
                    childen[i].getComponent(Sprite).color = color(255,255,255);
                }
            }else{
                childen[i].active = false; 
            }
        }
    }

    protected setOtherData(cityData:any,orderId:number = 1):void{
        this._cityData = cityData;
        this._orderId = orderId
        this.delNode.active = true;
    }


    protected onClickGeneral(event:any): void {
        if(this._curData){
            var cfgData = this._curData.config;
            console.log("onClickGeneral:", this._type);
            
            //武将详情
             if(this._type == GeneralItemType.GeneralInfo){
                 EventMgr.emit("open_general_des",cfgData, this._curData);
             }
             
             //上阵
             else if(this._type == GeneralItemType.GeneralDispose){
                 EventMgr.emit("chosed_general", cfgData, this._curData, this._position);
             }

             //征兵
             else if(this._type == GeneralItemType.GeneralConScript){
                 EventMgr.emit("open_army_conscript", this._orderId, this._cityData);
             }

             else if(this._type == GeneralItemType.GeneralSelect){
                this._isSelect = !this._isSelect;
                this.select(this._isSelect);
                EventMgr.emit("open_general_select", cfgData, this._curData, this.node);
             }
        }

        
    }




    /**
     * 下阵
     */
    protected onDelete():void{
        var cfgData = this._curData.config;
        EventMgr.emit("chosed_general",cfgData,this._curData,-1);
    }




    /**
     * 战报的
     * @param curData 
     */
    public setWarReportData(curData:any):void{
        this.updateView(curData)
    }

}
