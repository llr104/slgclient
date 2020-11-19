// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html


import LoginCommand from "../../login/LoginCommand";
import MapUICommand from "./MapUICommand";
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


    
    @property(cc.Prefab)
    generalDisPosePrefab: cc.Prefab = null;
    protected _generalDisPoseNode: cc.Node = null;


    @property(cc.Prefab)
    cityAboutPrefab: cc.Prefab = null;
    protected _cityAboutNode: cc.Node = null;


    @property(cc.Prefab)
    conscriptPrefab: cc.Prefab = null;
    protected _conscriptNode: cc.Node = null;

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


        cc.systemEvent.on("open_city_about", this.openCityAbout, this);

        cc.systemEvent.on("open_facility", this.openFacility, this);
        cc.systemEvent.on("open_facility_des", this.openFacilityDes, this);
        
        cc.systemEvent.on("onRoleMyRoleRes", this.updateRole, this);
        
        cc.systemEvent.on("open_general_des", this.openGeneralDes, this);


        cc.systemEvent.on("open_general_dispose", this.openGeneralDisPose, this);


        cc.systemEvent.on("open_general_conscript", this.openConscript, this);
        this.updateRole();
        
    }


    protected onDestroy():void{
        this.clearAllNode();
        MapUICommand.getInstance().proxy.destory();
        cc.systemEvent.targetOff(this);
    }

    protected onBack():void{
        LoginCommand.getInstance().account_logout();
    }


    protected clearAllNode():void{
        this._facilityNode = null;
        this._facilityDesNode = null;
        this._generalNode = null;
        this._cityAboutNode = null;
        this._conscriptNode = null;
        this._generalDisPoseNode = null;
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
     * 武将配置
     */
    protected openGeneralDisPose(data:any):void{
        if (this._generalDisPoseNode == null) {
            this._generalDisPoseNode = cc.instantiate(this.generalDisPosePrefab);
            this._generalDisPoseNode.parent = this.node;
        } else {
            this._generalDisPoseNode.active = true;
        }

        this._generalDisPoseNode.getComponent("GeneralDisposeLogic").setData(data);
    }




    /**
     * 城市
     */
    protected openCityAbout(data:any):void{
        if (this._cityAboutNode == null) {
            this._cityAboutNode = cc.instantiate(this.cityAboutPrefab);
            this._cityAboutNode.parent = this.node;
        } else {
            this._cityAboutNode.active = true;
        }
        this._cityAboutNode.getComponent("CityAboutLogic").setData(data);
    }




    /**
     * 征兵
     */
    protected openConscript(orderId:number = 0,cityData:any):void{
        if (this._conscriptNode == null) {
            this._conscriptNode = cc.instantiate(this.conscriptPrefab);
            this._conscriptNode.parent = this.node;
        } else {
            this._conscriptNode.active = true;
        }

        this._conscriptNode.getComponent("ConscriptLogic").setData(orderId,cityData);
    }


    /**
     * 角色信息
     */
    protected updateRole():void{
        var str:string = ""
        var roleRes = LoginCommand.getInstance().proxy.getRoleResData();
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
