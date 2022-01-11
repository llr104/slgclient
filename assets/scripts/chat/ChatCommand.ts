import { _decorator } from 'cc';

import { NetManager } from "../network/socket/NetManager";
import { ServerConfig } from "../config/ServerConfig";
import ChatProxy from "./ChatProxy";
import { EventMgr } from '../utils/EventMgr';

export default class ChatCommand {
    //单例
    protected static _instance: ChatCommand;
    public static getInstance(): ChatCommand {
        if (this._instance == null) {
            this._instance = new ChatCommand();
        }
        return this._instance;
    }


    //数据model
    protected _proxy:ChatProxy = new ChatProxy();

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
        // EventMgr.on(ServerConfig.chat_chat, this.onChat, this)
        EventMgr.on(ServerConfig.chat_history, this.onChatHistory, this)
        EventMgr.on(ServerConfig.chat_push, this.onChat, this)
    }

    protected onChat(data:any):void{
        console.log("onChat:",data)
        if (data.code == 0) {
            if(data.msg.type == 0){
                this._proxy.updateWorldChat(data.msg);
            }else if (data.msg.type == 1){
                this._proxy.updateUnionChat(data.msg);
            }
            EventMgr.emit("update_chat_history");
        }
    }


    protected onChatHistory(data:any):void{
        console.log("onChatHistory:",data)
        if (data.code == 0) {
            if(data.msg.type == 0){
                this._proxy.updateWorldChatList(data.msg.msgs);
            }else if(data.msg.type == 1){
                this._proxy.updateUnionChatList(data.msg.msgs);
            }
            EventMgr.emit("update_chat_history");
        }
    }

    public onDestory(): void {
        EventMgr.targetOff(this);
    }

    public clearData(): void {
        this._proxy.clearData();
    }

    public get proxy(): ChatProxy {
        return this._proxy;
    }


    public chat(msg:string,type:number = 0):void{
        let sendData: any = {
            name: ServerConfig.chat_chat,
            msg: {
                msg:msg,
                type:type,
            }
        };
        NetManager.getInstance().send(sendData);
    }

    public join(type:number,id:number):void{
        let sendData: any = {
            name: ServerConfig.chat_join,
            msg: {
                type:type,
                id:id,
            }
        };
        NetManager.getInstance().send(sendData);
    }

    public exit(type:number,id:number):void{
        let sendData: any = {
            name: ServerConfig.chat_exit,
            msg: {
                type:type,
                id:id,
            }
        };
        NetManager.getInstance().send(sendData);
    }

    public chatHistory(type:number):void{
        let sendData: any = {
            name: ServerConfig.chat_history,
            msg: {
                type:type,
            }
        };
        NetManager.getInstance().send(sendData);
    }

    
}
