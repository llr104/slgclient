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

    @property(cc.Label)
    roleLabel: cc.Label = null;

    protected _nameObj:any = {};

    protected onLoad():void{

        this._nameObj = {
            decree:"令牌",
            grain:"谷物",
            wood:"木材",
            iron:"金属",
            stone:"石材",
            gold:"金钱",
            wood_yield:"木材产量",
            iron_yield:"金属产量",
            stone_yield:"石材产量",
            grain_yield:"谷物产量",
            gold_yield:"金钱产量",
            depot_capacity:"仓库容量"
        };

        cc.systemEvent.on("open_facility_des", this.openFacilityDes, this);
        cc.systemEvent.on("onRoleMyRoleRes", this.updateRole, this);

        this.updateRole();
        
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


    protected updateRole():void{
        var str:string = ""
        var roleRes = LoginCommand.getInstance().proxy.roleRes;
        for(var key in roleRes){
            str += this._nameObj[key] + ": " + roleRes[key] + " ";
        }

        this.roleLabel.string = str; 
    }

}
