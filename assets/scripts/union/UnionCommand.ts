import { NetManager } from "../network/socket/NetManager";
import UnionProxy, { Union } from "./UnionProxy";
import { ServerConfig } from "../config/ServerConfig";
import { MapCityData } from "../map/MapCityProxy";
import MapCommand from "../map/MapCommand";

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
        cc.systemEvent.on(ServerConfig.union_applyList, this.onUnionApply, this);
        cc.systemEvent.on(ServerConfig.union_verify, this.onUnionVerify, this);
        cc.systemEvent.on(ServerConfig.union_exit, this.onUnionDisMiss, this);
        cc.systemEvent.on(ServerConfig.union_kick, this.onUnionKick, this);
        cc.systemEvent.on(ServerConfig.union_appoint, this.onUnionAppoint, this);
        cc.systemEvent.on(ServerConfig.union_abdicate, this.onUnionAbdicate, this);
        cc.systemEvent.on(ServerConfig.union_modNotice, this.onUnionNotice, this)
        cc.systemEvent.on(ServerConfig.union_info, this.onUnionInfo, this);
        cc.systemEvent.on(ServerConfig.union_log, this.onUnionLog, this);
        cc.systemEvent.on(ServerConfig.union_apply_push, this.onUnionApplyPush, this);
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


    protected onUnionApply(data: any, otherData: any): void {
        console.log("onUnionApply", data);
        if (data.code == 0) {
            this._proxy.updateApplyList(data.msg.id, data.msg.applys);
            cc.systemEvent.emit("update_union_apply", data.msg.applys);
        }
    }


    protected onUnionVerify(data: any, otherData: any): void {
        console.log("onUnionVerify", data);
        if (data.code == 0) {
            cc.systemEvent.emit("kick_union_success");
            cc.systemEvent.emit("verify_union_success");
        }
    }


    protected onUnionKick(data: any, otherData: any): void {
        console.log("onUnionKick", data);
        if (data.code == 0) {
            cc.systemEvent.emit("kick_union_success");
        }
    }

    protected onUnionAppoint(data: any, otherData: any): void {
        console.log("onUnionAppoint", data);
        if (data.code == 0) {
            cc.systemEvent.emit("union_appoint", data.msg);
        }
    }

    protected onUnionAbdicate(data: any, otherData: any): void {
        console.log("onUnionAbdicate", data);
        if (data.code == 0) {
            cc.systemEvent.emit("union_abdicate", data.msg);
        }
    }


    protected onUnionNotice(data: any, otherData: any): void {
        console.log("onUnionNotice", data);
        if(data.code == 0){
            this._proxy.updateNotice(data.msg.id, data.msg.text)
            cc.systemEvent.emit("union_notice", data.msg);
        }
        
    }

    protected onUnionInfo(data: any, otherData: any): void {
        console.log("onUnionInfo", data);
        if(data.code == 0){
            let l = []
            l.push(data.msg.info)
            this._proxy.updateUnionList(l);

            cc.systemEvent.emit("union_info", data.msg);
        }
    }

    protected onUnionLog(data: any, otherData: any): void {
        console.log("onUnionLog", data);
        if(data.code == 0){
            cc.systemEvent.emit("union_log", data.msg.logs);
        }
    }
    
    protected onUnionApplyPush(data: any, otherData: any): void {
        console.log("onUnionApplyPush", data);
        let city:MapCityData = MapCommand.getInstance().cityProxy.getMyMainCity();
        let unionData:Union = UnionCommand.getInstance().proxy.getUnion(city.unionId);
        if (unionData && unionData.isMajor(city.rid)){
            this._proxy.updateApply(city.unionId, data.msg);
            cc.systemEvent.emit("update_union_apply", data.msg);
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

    public unionInfo(id:number = 0):void{
        let sendData: any = {
            name: ServerConfig.union_info,
            msg: {
                id:id
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


    public unionVerify(id:number = 0,decide:number = 0):void{
        let sendData: any = {
            name: ServerConfig.union_verify,
            msg: {
                id:id,
                decide:decide
            }
        };
        NetManager.getInstance().send(sendData);
    }

    
    public unionExit():void{
        let sendData: any = {
            name: ServerConfig.union_exit,
            msg: {
            }
        };
        NetManager.getInstance().send(sendData);
    }


    public unionKick(rid:number = 0):void{
        let sendData: any = {
            name: ServerConfig.union_kick,
            msg: {
                rid:rid,
            }
        };
        console.log("unionKick");
        NetManager.getInstance().send(sendData);
    }

    public unionAppoint(rid:number = 0, title=1):void{
        let sendData: any = {
            name: ServerConfig.union_appoint,
            msg: {
                rid:rid,
                title:title
            }
        };
        NetManager.getInstance().send(sendData);
    }

    public unionAbdicate(rid:number = 0):void{
        let sendData: any = {
            name: ServerConfig.union_abdicate,
            msg: {
                rid:rid
            }
        };
        NetManager.getInstance().send(sendData);
    }

    public modNotice(text:string):void{
        let sendData: any = {
            name: ServerConfig.union_modNotice,
            msg: {
                text:text,
            }
        };
        NetManager.getInstance().send(sendData);
    }

    public appoint(rid:number = 0):void{
        let sendData: any = {
            name: ServerConfig.union_kick,
            msg: {
                rid:rid,
            }
        };
        NetManager.getInstance().send(sendData);
    }

    public unionLog():void{
        let sendData: any = {
            name: ServerConfig.union_log,
            msg: {
            }
        };
        NetManager.getInstance().send(sendData);
    }
}