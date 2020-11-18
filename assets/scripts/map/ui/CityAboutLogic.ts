// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import LoginCommand from "../../login/LoginCommand";
import MapCommand from "../MapCommand";
import MapUICommand from "./MapUICommand";


const { ccclass, property } = cc._decorator;

@ccclass
export default class CityAboutLogic extends cc.Component {


    private _cityData:any = null;
    protected onLoad():void{
        
    }


    protected onDestroy():void{
        cc.systemEvent.targetOff(this);
    }

    protected onClickClose(): void {
        this.node.active = false;
    }



    public setData(data:any):void{
        this._cityData = data;

    }



    protected openFacility():void{
        this.onClickClose();
        cc.systemEvent.emit("open_facility", this._cityData);
    }



    protected openGeneralDisPose():void{
        this.onClickClose();
        cc.systemEvent.emit("open_general_dispose", this._cityData);
    }

}
