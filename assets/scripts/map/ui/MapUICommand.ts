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
     * 加载设施配置
     */
    public initMapJsonConfig():void{
        cc.resources.loadDir("./config/json/", cc.JsonAsset, this.loadJsonResComplete.bind(this));
    }


    public loadJsonResComplete(error: Error, asset: [cc.JsonAsset]):void{
        if(!error){
            this._proxy.setAllFacilityCfg(asset);
        }else{
            console.log("loadJsonResComplete--asset:",error)
        }
    }


}