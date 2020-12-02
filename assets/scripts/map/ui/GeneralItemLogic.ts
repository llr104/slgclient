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


    
    @property(cc.Layout)
    starLayout:cc.Layout = null;

    @property(cc.Node)
    delNode:cc.Node = null;

    private _curData:GeneralData = null;
    private _type:number = -1;
    private _position:number = 0;
    private _cityData:any = null;
    private _orderId:number = 1;

    protected onLoad():void{
        this.delNode.active = false;
    }


    protected setData(curData:GeneralData,type:number = 0,position:number = 0):void{
        this._curData = curData;
        this.updateView(this._curData);
        this._type = type;
        this._position = position;
    }



    protected updateItem(curData:any):void{
        this._curData = curData;
        this.updateView(this._curData);
        this._type = curData.type == undefined?-1:curData.type;
        this._position = curData.position == undefined?0:curData.position;
    }


    protected updateView(curData:any):void{
        var cfgData = GeneralCommand.getInstance().proxy.getGeneralCfg(curData.cfgId);
        this.nameLabel.string = cfgData.name 
        this.lvLabel.string = " Lv." +  curData.level ;
        this.spritePic.spriteFrame = GeneralCommand.getInstance().proxy.getGeneralTex(curData.cfgId);
        this.showStar(cfgData.star);
        this.delNode.active = false;
    }



    protected showStar(star:number = 3):void{
        var childen = this.starLayout.node.children;
        for(var i = 0;i<childen.length;i++){
            if(i < star){
                childen[i].active = true;
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
            var cfgData = GeneralCommand.getInstance().proxy.getGeneralCfg(this._curData.cfgId);

            //武将详情
             if(this._type == GeneralItemType.GeneralInfo){
                 cc.systemEvent.emit("open_general_des",cfgData,this._curData);
             }
             
             //上阵
             else if(this._type == GeneralItemType.GeneralDispose){
                 cc.systemEvent.emit("chosed_general",cfgData,this._curData,this._position);
             }

             //征兵
             else if(this._type == GeneralItemType.GeneralConScript){
                 cc.systemEvent.emit("open_general_conscript", this._orderId,this._cityData);
             }
        }

        
    }




    /**
     * 下阵
     */
    protected onDelete():void{
        var cfgData = GeneralCommand.getInstance().proxy.getGeneralCfg(this._curData.cfgId);
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
