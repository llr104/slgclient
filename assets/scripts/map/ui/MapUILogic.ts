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


    @property(cc.Prefab)
    generalPrefab: cc.Prefab = null;
    protected _generalNode: cc.Node = null;



    @property(cc.Prefab)
    generalDesPrefab: cc.Prefab = null;
    protected _generalDesNode: cc.Node = null;

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
        cc.systemEvent.on("open_facility", this.openFacility, this);
        cc.systemEvent.on("open_general_des", this.openGeneralDes, this);
        this.updateRole();
        
    }


    protected onDestroy():void{
        this.clearAllNode();
        cc.systemEvent.targetOff(this);
    }

    protected onBack():void{
        LoginCommand.getInstance().account_logout();
    }


    protected clearAllNode():void{
        this._facilityNode = null;
        this._facilityDesNode = null;
        this._generalNode = null;
    }


    /**
     * 设施
     */
    protected openFacility(data:any):void{
        if (this._facilityNode == null) {
            this._facilityNode = cc.instantiate(this.facilityPrefab);
            this._facilityNode.parent = this.node;
        } else {
            this._facilityNode.active = true;
        }

        this._facilityNode.getComponent("FacilityLogic").setData(data);
    }



    /**
     * 设施详情
     * @param data 
     */
    protected openFacilityDes(data:any):void{
        if (this._facilityDesNode == null) {
            this._facilityDesNode = cc.instantiate(this.facilityDesPrefab);
            this._facilityDesNode.parent = this.node;
        } else {
            this._facilityDesNode.active = true;
        }

        this._facilityDesNode.getComponent("FacilityDesLogic").setData(data);
    }




    /**
     * 武将
     */
    protected openGeneral():void{
        if (this._generalNode == null) {
            this._generalNode = cc.instantiate(this.generalPrefab);
            this._generalNode.parent = this.node;
        } else {
            this._generalNode.active = true;
        }
    }



    /**
     * 武将详情
     */
    protected openGeneralDes(cfgData:any,curData:any):void{
        if (this._generalDesNode == null) {
            this._generalDesNode = cc.instantiate(this.generalDesPrefab);
            this._generalDesNode.parent = this.node;
        } else {
            this._generalDesNode.active = true;
        }

        this._generalDesNode.getComponent("GeneralDesLogic").setData(cfgData,curData);
    }



    /**
     * 角色信息
     */
    protected updateRole():void{
        var str:string = ""
        var roleRes = LoginCommand.getInstance().proxy.roleRes;
        var c = 0;
        for(var key in roleRes){
            str += this._nameObj[key] + ": " + roleRes[key] + " ";
            if(c > 6){
                str +="\n"
                c = 0;
            }
            c++
        }

        this.roleLabel.string = str; 
    }

}
