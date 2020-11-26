// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import GeneralCommand from "../../general/GeneralCommand";
import { GeneralData } from "../../general/GeneralProxy";


const { ccclass, property } = cc._decorator;

@ccclass
export default class GeneralItemLogic extends cc.Component {


    @property(cc.Label)
    msgLabel: cc.Label = null;

    @property(cc.Sprite)
    spritePic:cc.Sprite = null;


    @property(cc.Node)
    delNode:cc.Node = null;

    private _curData:GeneralData = null;
    private _type:number = 0;
    private _position:number = 0;
    private _cityData:any = null;
    private _orderId:number = 1;

    protected onLoad():void{
        this.delNode.active = false;
    }


    protected setData(curData:GeneralData,type:number = 0,position:number = 0):void{
        this._curData = curData;
        this._type = type;
        this._position = position;


        var cfgData = GeneralCommand.getInstance().proxy.getGeneralCfg(this._curData.cfgId);
        this.msgLabel.string = cfgData.name;
        this.spritePic.spriteFrame = GeneralCommand.getInstance().proxy.getGeneralTex(this._curData.cfgId);
        this.delNode.active = false;
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
             if(this._type == 0){
                 cc.systemEvent.emit("open_general_des",cfgData,this._curData);
             }
             
             //上阵
             else if(this._type == 1){
                 cc.systemEvent.emit("chosed_general",cfgData,this._curData,this._position);
             }

             //征兵
             else if(this._type == 2){
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




    public setWarReportData(curData:any):void{
        var cfgData = GeneralCommand.getInstance().proxy.getGeneralCfg(curData.cfgId);
        this.msgLabel.string = "Lv" + curData.level + " " + cfgData.name;
        this.spritePic.spriteFrame = GeneralCommand.getInstance().proxy.getGeneralTex(curData.cfgId);
        this.delNode.active = false;
    }

}
