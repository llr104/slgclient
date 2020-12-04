import { ServerConfig } from "../../config/ServerConfig";
import LoginCommand from "../../login/LoginCommand";
import { NetManager } from "../../network/socket/NetManager";
import { MapCityData } from "../MapCityProxy";
import MapCommand from "../MapCommand";
import MapUIProxy, { CityAddition, Facility } from "./MapUIProxy";

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
        cc.systemEvent.on(ServerConfig.city_upCity, this.onCityUpCity, this);
        cc.systemEvent.on(ServerConfig.role_myRoleRes, this.onRoleMyRoleRes, this);
        cc.systemEvent.on(ServerConfig.war_report, this.onUpdataWarReports, this);
        cc.systemEvent.on(ServerConfig.war_reportPush, this.onUpdataWarReport, this);
        cc.systemEvent.on(ServerConfig.war_read, this.onUpdataWarRead, this);
        cc.systemEvent.on(ServerConfig.roleRes_push, this.updataRoleRes, this);
    }

    protected onCityFacilities(data: any): void {
        console.log("onCityFacilities :", data);
        if (data.code == 0) {
            this._proxy.updateMyFacilityList(data.msg.cityId, data.msg.facilities);
            let cityData: MapCityData = MapCommand.getInstance().cityProxy.getMyCityById(data.msg.cityId);
            if (cityData) {
                this._proxy.updateMyFacility(cityData.cityId, { type: 0, level: cityData.level });
            }
            cc.systemEvent.emit("update_my_facilities");
            let addition: CityAddition = this._proxy.updateMyCityAdditions(cityData.cityId);
            cc.systemEvent.emit("update_city_addition", cityData.cityId, addition);
        }
    }


    protected onCityUpFacilities(data: any): void {
        console.log("onCityUpFacilities :", data);
        if (data.code == 0) {
            let facilityData: Facility = this._proxy.updateMyFacility(data.msg.cityId, data.msg.facility);
            cc.systemEvent.emit("update_my_facility", data.msg.cityId, facilityData);
            LoginCommand.getInstance().proxy.saveEnterData(data.msg);
            cc.systemEvent.emit("upate_my_roleRes");
            let addition: CityAddition = this._proxy.updateMyCityAdditions(data.msg.cityId);
            cc.systemEvent.emit("update_city_addition", data.msg.cityId, addition);
        }
    }

    protected onCityUpCity(data: any): void {
        console.log("onCityUpCity :", data, data.code == 0);
        if (data.code == 0) {
            let facilityData: Facility = this._proxy.updateMyFacility(data.msg.city.cityId, { type: 0, level: data.msg.city.level });
            cc.systemEvent.emit("update_my_facility", data.msg.city.cityId, facilityData);
            let addition: CityAddition = this._proxy.updateMyCityAdditions(data.msg.city.cityId);
            cc.systemEvent.emit("update_city_addition", data.msg.city.cityId, addition);
        }
    }

    protected onRoleMyRoleRes(data: any): void {
        console.log("onRoleMyProperty :", data);
        if (data.code == 0) {
            LoginCommand.getInstance().proxy.saveEnterData(data.msg);
            cc.systemEvent.emit("upate_my_roleRes");
        }
    }


    protected updataRoleRes(data: any): void {
        if (data.code == 0) {
            LoginCommand.getInstance().proxy.setRoleResData(data.msg);
            cc.systemEvent.emit("upate_my_roleRes");
        }
    }


    protected onUpdataWarReports(data: any): void {
        console.log("onUpdataWarReport :", data);
        if (data.code == 0) {
            this._proxy.updateWarReports(data.msg);
            cc.systemEvent.emit("upate_war_report");
        }
    }



    protected onUpdataWarReport(data: any): void {
        console.log("onUpdataWarReport :", data);
        if (data.code == 0) {
            this._proxy.updateWarReport(data.msg);
            cc.systemEvent.emit("upate_war_report");
        }
    }

    protected onUpdataWarRead(data: any): void {
        console.log("onUpdataWarRead :", data);
        if (data.code == 0) {
            var id = data.msg.id;
            this._proxy.updateWarRead(id, true);
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
    public qryCityFacilities(cityId: number = 0): void {
        let sendData: any = {
            name: ServerConfig.city_facilities,
            msg: {
                cityId: cityId,
            }
        };
        NetManager.getInstance().send(sendData);
    }


    /**
     * 升级设施
     * @param cityId 
     * @param ftype 
     */
    public upFacility(cityId: number = 0, ftype: number = 0): void {
        let sendData: any = {
            name: ServerConfig.city_upFacility,
            msg: {
                cityId: cityId,
                fType: ftype,
            }
        };
        NetManager.getInstance().send(sendData);
    }

    /**
     * 升级城池
     * @param cityId 
     * @param ftype 
     */
    public upCity(cityId: number = 0): void {
        let sendData: any = {
            name: ServerConfig.city_upCity,
            msg: {
                cityId: cityId,
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
    public updateMyProperty(data: any): void {
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
    public warRead(id: number = 0): void {
        let sendData: any = {
            name: ServerConfig.war_read,
            msg: {
                id: id,
            }
        };
        NetManager.getInstance().send(sendData);
    }



}