import { ServerConfig } from "../../config/ServerConfig";
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

    }

    protected onCityFacilities(data:any):void{
        console.log("onCityFacilities :",data);
        if(data.code == 0){
            this._proxy.setMyFacility(data.msg);
            cc.systemEvent.emit("getCityFacilities");
        }
    }

    public onDestory(): void {
        cc.systemEvent.targetOff(this);
    }

    public get proxy(): MapUIProxy {
        return this._proxy;
    }


    public qryCityFacilities(cityId:number = 0): void {
        let sendData: any = {
            name: ServerConfig.city_facilities,
            msg: {
                cityId:cityId,
            }
        };
        NetManager.getInstance().send(sendData);
    }

}