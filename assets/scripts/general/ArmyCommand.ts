import { ServerConfig } from "../config/ServerConfig";
import LoginCommand from "../login/LoginCommand";
import { NetManager } from "../network/socket/NetManager";
import ArmyProxy, { ArmyData } from "./ArmyProxy";
import GeneralCommand from "./GeneralCommand";
import { GeneralData } from "./GeneralProxy";


export default class ArmyCommand {
    //单例
    protected static _instance: ArmyCommand;
    public static getInstance(): ArmyCommand {
        if (this._instance == null) {
            this._instance = new ArmyCommand();
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
    protected _proxy: ArmyProxy = new ArmyProxy();

    constructor() {
        cc.systemEvent.on(ServerConfig.general_armyList, this.onQryArmyList, this);
        cc.systemEvent.on(ServerConfig.general_dispose, this.onGeneralDispose, this);
        cc.systemEvent.on(ServerConfig.general_conscript, this.onGeneralConscript, this);
        cc.systemEvent.on(ServerConfig.general_assignArmy, this.onGeneralAssignArmy, this);
        cc.systemEvent.on(ServerConfig.general_armyStatePush, this.onGeneralArmyStatePush, this);
    }

    public onDestory(): void {
        cc.systemEvent.targetOff(this);
    }

    public clearData():void {
        this._proxy.clearData();
    }

    public get proxy(): ArmyProxy {
        return this._proxy;
    }

    /**军队列表回调*/
    protected onQryArmyList(data: any, otherData: any): void {
        console.log("onQryArmyList", data);
        if (data.code == 0) {
            let armyDatas: ArmyData[] = this._proxy.updateArmys(data.msg.cityId, data.msg.armys);
            cc.systemEvent.emit("update_army_list", armyDatas);
        }
    }

    /**配置将领回调*/
    protected onGeneralDispose(data: any, otherData: any): void {
        console.log("onGeneralDispose", data);
        if (data.code == 0) {
            let armyData: ArmyData = this._proxy.updateArmy(data.msg.army.cityId, data.msg.army);
            console.log("armyData", armyData);
            cc.systemEvent.emit("update_army", armyData);
        }
    }

    /**征兵回调*/
    protected onGeneralConscript(data: any, otherData: any): void {
        console.log("onGeneralConscript", data);
        if (data.code == 0) {
            LoginCommand.getInstance().proxy.saveEnterData(data.msg);
            cc.systemEvent.emit("upate_my_roleRes");

            let armyData: ArmyData = this._proxy.updateArmy(data.msg.army.cityId, data.msg.army);
            cc.systemEvent.emit("update_army", armyData);
            cc.systemEvent.emit("conscript_army_success");
        }
    }

    /**出征回调*/
    protected onGeneralAssignArmy(data: any, otherData: any): void {
        console.log("onGeneralAssignArmy", data);
        if (data.code == 0) {
            let armyData: ArmyData = this._proxy.updateArmy(data.msg.army.cityId, data.msg.army);
            cc.systemEvent.emit("update_army", armyData);
            cc.systemEvent.emit("update_army_assign");
        }
    }

    /**军队状态变更*/
    protected onGeneralArmyStatePush(data: any): void {
        console.log("onGeneralArmyState", data);
        if (data.code == 0) {
            let armyData: ArmyData = this._proxy.updateArmy(data.msg.army.cityId, data.msg.army);
            cc.systemEvent.emit("update_army", armyData);
        }
    }

    /**我的角色属性*/
    public updateMyProperty(datas: any[]): void {
        if (datas.length > 0) {
            let armyDatas: ArmyData[] = this._proxy.updateArmys(datas[0].cityId, datas);
            cc.systemEvent.emit("update_army_list", armyDatas);
        }
    }

    /**获取军队当前体力*/
    public getArmyPhysicalPower(armyData: ArmyData):number {
        let minPower:number = 100;
        for (let i:number = 0; i < armyData.generals.length; i++) {
            let general:GeneralData = GeneralCommand.getInstance().proxy.getMyGeneral(armyData.generals[i]);
            if (general && minPower > general.physical_power) {
                minPower = general.physical_power;
            }
        }
        return minPower;
    }

    /**请求自己的军队信息*/
    public qryArmyList(cityId: number): void {
        let sendData: any = {
            name: ServerConfig.general_armyList,
            msg: {
                cityId: cityId
            }
        };
        NetManager.getInstance().send(sendData);
    }

    /**给军队配置将领*/
    public generalDispose(cityId: number = 0, generalId: number = 0, order: number = 0, position: number = 0, otherData: any): void {
        let sendData: any = {
            name: ServerConfig.general_dispose,
            msg: {
                cityId: cityId,
                generalId: generalId,
                order: order,
                position: position,
            }
        };
        NetManager.getInstance().send(sendData, otherData);
    }

    /**给军队征兵*/
    public generalConscript(armyId: number = 0, cnts:number[] = [], otherData: any): void {
        let sendData: any = {
            name: ServerConfig.general_conscript,
            msg: {
                armyId: armyId,
                cnts: cnts,
            }
        };
        NetManager.getInstance().send(sendData, otherData);
    }

    /**出兵*/
    public generalAssignArmy(armyId: number = 0, cmd: number = 0, x: number = 0, y: Number = 0, otherData: any = null): void {
        let sendData: any = {
            name: ServerConfig.general_assignArmy,
            msg: {
                armyId: armyId,
                cmd: cmd,
                x: x,
                y: y,
            }
        };
        NetManager.getInstance().send(sendData, otherData);
    }
}