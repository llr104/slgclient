import { NetManager } from "../network/socket/NetManager";
import UnionProxy from "./UnionProxy";
import { ServerConfig } from "../config/ServerConfig";

export default class UnionCommand {
    //单例
    protected static _instance: UnionCommand;
    public static getInstance(): UnionCommand {
        if (this._instance == null) {
            this._instance = new UnionCommand();
        }
        return this._instance;
    }


    //数据model
    protected _proxy: UnionProxy = new UnionProxy();

    public static destory(): boolean {
        if (this._instance) {
            this._instance.onDestory();
            this._instance = null;
            return true;
        }
        return false;
    }

    //数据model

    constructor() {
        cc.systemEvent.on(ServerConfig.coalition_create, this.onCoalitionCreate, this);
        cc.systemEvent.on(ServerConfig.coalition_join, this.onCoalitionJoin, this);
        cc.systemEvent.on(ServerConfig.coalition_list, this.onCoalitionList, this);
        cc.systemEvent.on(ServerConfig.coalition_member, this.onCoalitionMember, this);
    }

    public onDestory(): void {
        cc.systemEvent.targetOff(this);
    }

    public clearData(): void {
        this._proxy.clearData();
    }

    public get proxy(): UnionProxy {
        return this._proxy;
    }


    protected onCoalitionCreate(data: any, otherData: any): void {
        console.log("onCoalitionCreate", data);
        if (data.code == 0) {
            cc.systemEvent.emit("create_union_success");
        }
    }


    protected onCoalitionJoin(data: any, otherData: any): void {
        console.log("onCoalitionJoin", data);
        if (data.code == 0) {
        }
    }


    protected onCoalitionList(data: any, otherData: any): void {
        console.log("onCoalitionList", data);
        if (data.code == 0) {
        }
    }


    protected onCoalitionMember(data: any, otherData: any): void {
        console.log("onCoalitionMember", data);
        if (data.code == 0) {
            cc.systemEvent.emit("upate_union_member");
        }
        
    }


    public coalitionCreate(name:string):void{
        let sendData: any = {
            name: ServerConfig.coalition_create,
            msg: {
                name: name,
            }
        };
        NetManager.getInstance().send(sendData);
    }


    public coalitionJoin(id:number = 0):void{
        let sendData: any = {
            name: ServerConfig.coalition_create,
            msg: {
                id: id,
            }
        };
        NetManager.getInstance().send(sendData);
    }


    public coalitionList():void{
        let sendData: any = {
            name: ServerConfig.coalition_list,
            msg: {
            }
        };
        NetManager.getInstance().send(sendData);
    }


    public coalitionMember(id:number = 0):void{
        let sendData: any = {
            name: ServerConfig.coalition_member,
            msg: {
                id: id,
            }
        };
        NetManager.getInstance().send(sendData);
    }
}