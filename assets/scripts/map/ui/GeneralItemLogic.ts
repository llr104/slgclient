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

    private _curData:GeneralData = null;
    private _type:number = 0;
    private _position:number = 0;
    private _cityData:any = null;
    private _orderId:number = 1;

    protected onLoad():void{

    }


    protected setData(curData:GeneralData,type:number = 0,position:number = 0):void{
        // console.log("GeneralItemLogic---curData:",curData)
        this._curData = curData;
        this._type = type;
        this._position = position;


        this.msgLabel.string = this._curData.name;
        this.spritePic.spriteFrame = GeneralCommand.getInstance().proxy.getGeneralTex(this._curData.cfgId);
    }



    protected setOtherData(cityData:any,orderId:number = 1):void{
        this._cityData = cityData;
        this._orderId = orderId
    }


    protected onClickGeneral(event:any): void {
        var cfgData = GeneralCommand.getInstance().proxy.getGeneralCfg(this._curData.cfgId);

        console.log("onClickGeneral:",cfgData,this._curData,this._position,this._type)
        if(this._type == 0){
            cc.systemEvent.emit("open_general_des",cfgData,this._curData);
        }
        
        else if(this._type == 1){
            cc.systemEvent.emit("chosed_general",cfgData,this._curData,this._position);
        }
        else{
            cc.systemEvent.emit("open_general_conscript", this._orderId,this._cityData);
        }
        
    }

}
