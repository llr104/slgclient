// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html



/**军队命令*/
export class GeneralItemType {
    static GeneralInfo: number = 0;//武将详情
    static GeneralDispose: number = 1;//武将上阵
    static GeneralConScript: number = 2;//武将征兵
    static GeneralNoThing: number = 3;//无用
    static GeneralSelect: number = 4;//选择
}


import GeneralCommand from "../../general/GeneralCommand";
import { GeneralData } from "../../general/GeneralProxy";


const { ccclass, property } = cc._decorator;

@ccclass
export default class GeneralItemLogic extends cc.Component {


    @property(cc.Label)
    nameLabel: cc.Label = null;

    @property(cc.Label)
    lvLabel: cc.Label = null;

    @property(cc.Sprite)
    spritePic:cc.Sprite = null;

    @property(cc.Label)
    costLabel: cc.Label = null;

    
    @property(cc.Layout)
    starLayout:cc.Layout = null;

    @property(cc.Node)
    delNode:cc.Node = null;

    @property(cc.Node)
    useNode:cc.Node = null;


    @property(cc.Node)
    selectNode:cc.Node = null;

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



    protected updateItem(curData:any):void{
        this.updateView(curData);
        this._type = this._curData.type == undefined?-1:this._curData.type;
        this._position = this._curData.position == undefined?0:this._curData.position;
    }


    protected updateView(curData:any):void{
        this._curData = curData;

        var cfgData = GeneralCommand.getInstance().proxy.getGeneralCfg(this._curData.cfgId);
        this.nameLabel.string = cfgData.name 
        this.lvLabel.string = " Lv." +  this._curData.level ;
        this.spritePic.spriteFrame = GeneralCommand.getInstance().proxy.getGeneralTex(this._curData.cfgId);
        this.showStar(cfgData.star,this._curData.star_lv);
        this.delNode.active = false;

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
                    childen[i].color = cc.color(255,0,0);
                }else{
                    childen[i].color = cc.color(255,255,255);
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

            //武将详情
             if(this._type == GeneralItemType.GeneralInfo){
                 cc.systemEvent.emit("open_general_des",cfgData, this._curData);
             }
             
             //上阵
             else if(this._type == GeneralItemType.GeneralDispose){
                 cc.systemEvent.emit("chosed_general", cfgData, this._curData, this._position);
             }

             //征兵
             else if(this._type == GeneralItemType.GeneralConScript){
                 cc.systemEvent.emit("open_army_conscript", this._orderId, this._cityData);
             }

             else if(this._type == GeneralItemType.GeneralSelect){
                this._isSelect = !this._isSelect;
                this.select(this._isSelect);
                cc.systemEvent.emit("open_general_select", cfgData, this._curData, this.node);
             }
        }

        
    }




    /**
     * 下阵
     */
    protected onDelete():void{
        var cfgData = this._curData.config;
        cc.systemEvent.emit("chosed_general",cfgData,this._curData,-1);
    }




    /**
     * 战报的
     * @param curData 
     */
    public setWarReportData(curData:any):void{
        this.updateView(curData)
    }

}
