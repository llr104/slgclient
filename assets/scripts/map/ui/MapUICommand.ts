import { _decorator } from 'cc';
import { ServerConfig } from "../../config/ServerConfig";
import LoginCommand from "../../login/LoginCommand";
import { NetManager } from "../../network/socket/NetManager";
import { MapCityData } from "../MapCityProxy";
import MapCommand from "../MapCommand";
import MapUIProxy, { CityAddition, Facility } from "./MapUIProxy";
import { EventMgr } from '../../utils/EventMgr';

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
        EventMgr.on(ServerConfig.city_facilities, this.onCityFacilities, this);
        EventMgr.on(ServerConfig.city_upFacility, this.onCityUpFacility, this);
        EventMgr.on(ServerConfig.role_myRoleRes, this.onRoleMyRoleRes, this);
        EventMgr.on(ServerConfig.war_report, this.onUpdataWarReports, this);
        EventMgr.on(ServerConfig.war_reportPush, this.onUpdataWarReport, this);
        EventMgr.on(ServerConfig.war_read, this.onUpdataWarRead, this);
        EventMgr.on(ServerConfig.interior_collect, this.onCollect, this);
        EventMgr.on(ServerConfig.interior_openCollect, this.onOpenCollect, this);

        EventMgr.on(ServerConfig.roleRes_push, this.updataRoleRes, this);
        

        setInterval(() => {
           let list: Map<number, Map<number, Facility>> = this._proxy.getMyAllFacilitys();
           list.forEach((fs, key) => { 
                fs.forEach(f => {
                    if(f.isNeedUpdateLevel()){
                        //倒计时完，请求最新的等级
                        console.log("有设施升级完了，需要刷新");
                        this.qryCityFacilities(key);
                        return
                    }
                });
           });
        }, 1000);
    }

    protected onCityFacilities(data: any): void {
        console.log("onCityFacilities :", data);
        if (data.code == 0) {
            this._proxy.updateMyFacilityList(data.msg.cityId, data.msg.facilities);
            EventMgr.emit("update_my_facilities");

            //刷新城池附加加成
            let cityData: MapCityData = MapCommand.getInstance().cityProxy.getMyCityById(data.msg.cityId);
            let addition: CityAddition = this._proxy.updateMyCityAdditions(cityData.cityId);
            cityData.maxDurable = this._proxy.getMyCityMaxDurable(data.msg.cityId);
            EventMgr.emit("update_city_addition", data.msg.cityId, addition);
        }
    }


    protected onCityUpFacility(data: any): void {
        console.log("onCityUpFacility :", data);
        if (data.code == 0) {
            let facilityData: Facility = this._proxy.updateMyFacility(data.msg.cityId, data.msg.facility);
            EventMgr.emit("update_my_facility", data.msg.cityId, facilityData);
            LoginCommand.getInstance().proxy.saveEnterData(data.msg);
            EventMgr.emit("upate_my_roleRes");

            //刷新城池附加加成
            let cityData: MapCityData = MapCommand.getInstance().cityProxy.getMyCityById(data.msg.cityId);
            let addition: CityAddition = this._proxy.updateMyCityAdditions(data.msg.cityId);
            cityData.maxDurable = this._proxy.getMyCityMaxDurable(data.msg.cityId);
            EventMgr.emit("update_city_addition", data.msg.cityId, addition);
        }
    }


    protected onRoleMyRoleRes(data: any): void {
        console.log("onRoleMyProperty :", data);
        if (data.code == 0) {
            LoginCommand.getInstance().proxy.saveEnterData(data.msg);
            EventMgr.emit("upate_my_roleRes");
        }
    }


    protected updataRoleRes(data: any): void {
        if (data.code == 0) {
            LoginCommand.getInstance().proxy.setRoleResData(data.msg);
            EventMgr.emit("upate_my_roleRes");
        }
    }


    protected onUpdataWarReports(data: any): void {
        console.log("onUpdataWarReport :", data);
        if (data.code == 0) {
            this._proxy.updateWarReports(data.msg);
            EventMgr.emit("upate_war_report");
        }
    }



    protected onUpdataWarReport(data: any): void {
        console.log("onUpdataWarReport :", data);
        if (data.code == 0) {
            this._proxy.updateWarReport(data.msg);
            EventMgr.emit("upate_war_report");
        }
    }

    protected onUpdataWarRead(data: any): void {
        console.log("onUpdataWarRead :", data);
        if (data.code == 0) {
            var id = data.msg.id;
            if (id == 0) {
                this._proxy.updateAllWarRead(true);
            }else{
                this._proxy.updateWarRead(id, true);
            }
           
            EventMgr.emit("upate_war_report");
        }
    }

    protected onCollect(data:any):void {
        console.log("onCollect :", data);
        if (data.code == 0) {
            EventMgr.emit("interior_collect", data.msg);
        }
    }

    protected onOpenCollect(data:any):void{
        console.log("onOpenCollect :", data);
        if (data.code == 0) {
            EventMgr.emit("interior_openCollect", data.msg);
        }
    }

    public onDestory(): void {
        EventMgr.targetOff(this);
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
        EventMgr.emit("upate_my_roleRes");
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

    public interiorCollect(): void {
        let sendData: any = {
            name: ServerConfig.interior_collect,
            msg: {
            }
        };
        NetManager.getInstance().send(sendData);
    }

    public interiorOpenCollect(): void {
        let sendData: any = {
            name: ServerConfig.interior_openCollect,
            msg: {
            }
        };
        NetManager.getInstance().send(sendData);
    }
    
    public interiorTransform(from:number[],to:number[]): void {
        let sendData: any = {
            name: ServerConfig.interior_transform,
            msg: {
                from:from,
                to:to
            }
        };
        NetManager.getInstance().send(sendData);
    }

}
