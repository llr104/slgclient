import { ServerConfig } from "../../config/ServerConfig";
import LoginCommand from "../../login/LoginCommand";
import { NetManager } from "../../network/socket/NetManager";
import MapUIProxy from "./MapUIProxy";



export default class MapUICommand {
    //单例
    protected static _instance: MapUICommand;
    public static getInstance(): MapUICommand {
        if (this._instance == null) {
            this._instance = new MapUICommand();
        }
        return this._instance;
    }

    public static destory(): boolean {
        if (this._instance) {
            this._instance.onDestory();
            this._instance = null;
            return true;
        }
        return false;
    }

    //数据model
    protected _proxy: MapUIProxy = new MapUIProxy();

    constructor() {
        cc.systemEvent.on(ServerConfig.city_facilities, this.onCityFacilities, this);
        cc.systemEvent.on(ServerConfig.city_upFacility, this.onCityUpFacilities, this);
        cc.systemEvent.on(ServerConfig.role_myRoleRes, this.onRoleMyRoleRes, this);
        cc.systemEvent.on(ServerConfig.general_myGenerals, this.onQryMyGenerals, this);

    }

    protected onCityFacilities(data:any):void{
        console.log("onCityFacilities :",data);
        if(data.code == 0){
            this._proxy.setMyFacility(data.msg);
            cc.systemEvent.emit("getCityFacilities");
        }
    }


    protected onCityUpFacilities(data:any):void{
        console.log("onCityUpFacilities :",data);
        if(data.code == 0){
            var cityId = data.msg.cityId;
            var facility = data.msg.facility;
            var facilityArr = this._proxy.getMyFacility(cityId);
            for(var i = 0;i < facilityArr.length ;i++ ){
                if(facilityArr[i].type == facility.type){
                    facilityArr[i].level = facility.level;
                    break;
                }
            }

            this._proxy.setMyFacilityByCityId(cityId,facilityArr);
            cc.systemEvent.emit("getCityFacilities");


            LoginCommand.getInstance().proxy.roleRes = data.msg.role_res;
            cc.systemEvent.emit("onRoleMyRoleRes");
        }
    }








    protected onRoleMyRoleRes(data:any):void{
        console.log("onRoleMyRoleRes :",data);
        if(data.code == 0){
            LoginCommand.getInstance().proxy.roleRes = data.msg.role_res;
            cc.systemEvent.emit("onRoleMyRoleRes");
        }
    }


    protected onQryMyGenerals(data:any):void{
        console.log("onQryMyGenerals :",data);
        if(data.code == 0){
            this._proxy.setMyGeneral(data.msg);
        }
        cc.systemEvent.emit("onQryMyGenerals");
    }

    public onDestory(): void {
        cc.systemEvent.targetOff(this);
    }

    public get proxy(): MapUIProxy {
        return this._proxy;
    }


    /**
     * 设施
     * @param cityId 
     */
    public qryCityFacilities(cityId:number = 0): void {
        let sendData: any = {
            name: ServerConfig.city_facilities,
            msg: {
                cityId:cityId,
            }
        };
        NetManager.getInstance().send(sendData);
    }


    /**
     * 升级设施
     * @param cityId 
     * @param ftype 
     */
    public upFacility(cityId:number = 0,ftype:number = 0):void{
        let sendData: any = {
            name: ServerConfig.city_upFacility,
            msg: {
                cityId:cityId,
                fType:ftype,
            }
        };
        NetManager.getInstance().send(sendData);
    }



    /**
     * 我的角色资源属性
     * @param cityId 
     */
    public qryMyRoleRes(): void {
        let sendData: any = {
            name: ServerConfig.role_myRoleRes,
            msg: {
            }
        };
        NetManager.getInstance().send(sendData);
    }




    /**
     * 我的武将
     */
    public qryMyGenerals():void{
        let sendData: any = {
            name: ServerConfig.general_myGenerals,
            msg: {
            }
        };
        NetManager.getInstance().send(sendData);
    }




    /**
     * 配置武将
     */
    public generalDispose(cityId:number = 0,generalId:number = 0,order:number = 0,position:number = 0):void{
        let sendData: any = {
            name: ServerConfig.general_dispose,
            msg: {
                cityId:cityId,
                generalId:generalId,
                order:order,
                position:position,
            }
        };
        NetManager.getInstance().send(sendData);
    }


    /**
     * 加载设施配置
     */
    public initMapJsonConfig():void{
        cc.resources.loadDir("./config/json/facility/", cc.JsonAsset, this.loadFacJsonComplete.bind(this));
        cc.resources.loadDir("./config/json/general/", cc.JsonAsset, this.loadGenJsonComplete.bind(this));
        cc.resources.loadDir("./generalpic/", cc.SpriteFrame, this.loadGenTexComplete.bind(this));
        this.qryMyGenerals();
    }


    public loadFacJsonComplete(error: Error, asset: [cc.JsonAsset]):void{
        if(!error){
            this._proxy.setAllFacilityCfg(asset);
            
        }else{
            console.log("loadFacJsonComplete--asset:",error)
        }
    }


    public loadGenJsonComplete(error: Error, asset: [cc.JsonAsset]):void{
        if(!error){
            this._proxy.setGeneralCfg(asset);
            
        }else{
            console.log("loadGenJsonComplete--asset:",error)
        }
    }



    public loadGenTexComplete(error: Error, asset: [cc.SpriteFrame]):void{
        if(!error){
            this._proxy.setGenTex(asset);
        }else{
            console.log("loadGenTexComplete--asset:",error)
        }
    }


}