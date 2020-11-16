// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html


import LoginCommand from "../../login/LoginCommand";
const { ccclass, property } = cc._decorator;

@ccclass
export default class MapUILogic extends cc.Component {

    @property(cc.Prefab)
    facilityPrefab: cc.Prefab = null;
    protected _facilityNode: cc.Node = null;



    @property(cc.Prefab)
    facilityDesPrefab: cc.Prefab = null;
    protected _facilityDesNode: cc.Node = null;

    protected onLoad():void{
        cc.systemEvent.on("open_facility_des", this.openFacilityDes, this);
    }


    protected onDestroy():void{
        this.clearAllNode();
        cc.systemEvent.targetOff(this);
    }

    protected onBack():void{
        LoginCommand.getInstance().account_logout();
    }




    protected onFacility():void{
        if (this._facilityNode == null) {
            this._facilityNode = cc.instantiate(this.facilityPrefab);
            this._facilityNode.parent = this.node;
        } else {
            this._facilityNode.active = true;
        }
    }


    protected clearAllNode():void{
        this._facilityNode = null;
        this._facilityDesNode = null;
    }



    protected openFacilityDes(data:any):void{
        if (this._facilityDesNode == null) {
            this._facilityDesNode = cc.instantiate(this.facilityDesPrefab);
            this._facilityDesNode.parent = this.node;
        } else {
            this._facilityDesNode.active = true;
        }

        this._facilityDesNode.getComponent("FacilityDesLogic").setData(data);
    }

}
