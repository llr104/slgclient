// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import LoginCommand from "../../login/LoginCommand";

const { ccclass, property } = cc._decorator;

@ccclass
export default class CityAboutLogic extends cc.Component {



    @property(cc.Node)
    typeNode1: cc.Node = null;


    
    @property(cc.Node)
    typeNode2: cc.Node = null;

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
        var roleData = LoginCommand.getInstance().proxy.getRoleData();
        this.typeNode1.active = this.typeNode2.active = false;
        if(roleData.rid == this._cityData.rid){
            this.typeNode1.active = true;
        }else{
            this.typeNode2.active = true;
        }
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
