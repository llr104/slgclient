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
        cc.systemEvent.on(ServerConfig.war_report, this.onUpdataWarReport, this);
        cc.systemEvent.on(ServerConfig.war_reportPush, this.onUpdataWarReport, this);
        cc.systemEvent.on(ServerConfig.war_read, this.onUpdataWarRead, this);
        cc.systemEvent.on(ServerConfig.roleRes_push, this.updataRoleRes, this);
    }

    protected onCityFacilities(data:any):void{
        console.log("onCityFacilities :",data);
        if(data.code == 0){
            this._proxy.setMyFacility(data.msg);
            cc.systemEvent.emit("update_my_facilities");
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
            cc.systemEvent.emit("update_my_facilities");


            LoginCommand.getInstance().proxy.saveEnterData(data.msg);
            cc.systemEvent.emit("upate_my_roleRes");
        }
    }

    protected onRoleMyRoleRes(data:any):void{
        console.log("onRoleMyProperty :",data);
        if(data.code == 0){
            LoginCommand.getInstance().proxy.saveEnterData(data.msg);
            cc.systemEvent.emit("upate_my_roleRes");
        }
    }


    protected updataRoleRes(data:any):void{
        if(data.code == 0){
            LoginCommand.getInstance().proxy.setRoleResData(data.msg);
            cc.systemEvent.emit("upate_my_roleRes");
        }
    }


    protected onUpdataWarReport(data:any):void{
        console.log("onUpdataWarReport :",data);
        if(data.code == 0){
            this._proxy.updateWarReport(data.msg);
            cc.systemEvent.emit("upate_war_report");
        }
    }



    protected onUpdataWarRead(data:any):void{
        console.log("onUpdataWarRead :",data);
        if(data.code == 0){
            var id = data.msg.id;
            this._proxy.updateWarRead(id,true);
            cc.systemEvent.emit("upate_war_report");
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
     * 我的角色资源属性(全)
     * @param 
     */
    public updateMyProperty(data:any): void {
        LoginCommand.getInstance().proxy.saveEnterData(data.msg);
        cc.systemEvent.emit("upate_my_roleRes");
    }



    /**
     * 战报查询
     */
    public qryWarReport(): void {
        let sendData: any = {
            name: ServerConfig.war_report,
            msg: {
            }
        };
        NetManager.getInstance().send(sendData);
    }



    /**
     * 读取
     */
    public warRead(id:number = 0): void {
        let sendData: any = {
            name: ServerConfig.war_read,
            msg: {
                id:id,
            }
        };
        NetManager.getInstance().send(sendData);
    }



}