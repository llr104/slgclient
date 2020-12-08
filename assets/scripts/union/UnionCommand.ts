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
        cc.systemEvent.on(ServerConfig.union_create, this.onUnionCreate, this);
        cc.systemEvent.on(ServerConfig.union_join, this.onUnionJoin, this);
        cc.systemEvent.on(ServerConfig.union_list, this.onUnionList, this);
        cc.systemEvent.on(ServerConfig.union_member, this.onUnionMember, this);
        cc.systemEvent.on(ServerConfig.union_dismiss, this.onUnionDisMiss, this);
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


    protected onUnionCreate(data: any, otherData: any): void {
        console.log("onUnionCreate", data);
        if (data.code == 0) {
            cc.systemEvent.emit("create_union_success");
            this.unionList();
        }
    }


    protected onUnionJoin(data: any, otherData: any): void {
        console.log("onUnionJoin", data);
        if (data.code == 0) {
        }
    }


    protected onUnionList(data: any, otherData: any): void {
        console.log("onUnionList", data);
        if (data.code == 0) {
            this._proxy.updateUnionList(data.msg.list);
            cc.systemEvent.emit("update_union_list",data.msg.list);
        }

    }


    protected onUnionMember(data: any, otherData: any): void {
        console.log("onUnionMember", data);
        if (data.code == 0) {
            this._proxy.updateMemberList(data.msg.id,data.msg.Members);
            cc.systemEvent.emit("update_union_member",data.msg.Members);
        }
        
    }


    protected onUnionDisMiss(data: any, otherData: any): void {
        console.log("onUnionDisMiss", data);
        if (data.code == 0) {
            this.unionList();
            cc.systemEvent.emit("dismiss_union_success");
        }
    }


    public unionCreate(name:string):void{
        let sendData: any = {
            name: ServerConfig.union_create,
            msg: {
                name: name,
            }
        };
        NetManager.getInstance().send(sendData);
    }


    public unionJoin(id:number = 0):void{
        let sendData: any = {
            name: ServerConfig.union_join,
            msg: {
                id: id,
            }
        };
        NetManager.getInstance().send(sendData);
    }


    public unionList():void{
        let sendData: any = {
            name: ServerConfig.union_list,
            msg: {
            }
        };
        NetManager.getInstance().send(sendData);
    }


    public unionMember(id:number = 0):void{
        let sendData: any = {
            name: ServerConfig.union_member,
            msg: {
                id: id,
            }
        };
        NetManager.getInstance().send(sendData);
    }


    public unionApplyList(id:number = 0):void{
        let sendData: any = {
            name: ServerConfig.union_applyList,
            msg: {
                id: id,
            }
        };
        NetManager.getInstance().send(sendData);
    }



    public unionDismiss():void{
        let sendData: any = {
            name: ServerConfig.union_dismiss,
            msg: {
            }
        };
        NetManager.getInstance().send(sendData);
    }
}