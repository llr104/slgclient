import { ChatNetManager, NetManager } from "../network/socket/NetManager";
import { ServerConfig } from "../config/ServerConfig";
import { MapCityData } from "../map/MapCityProxy";
import MapCommand from "../map/MapCommand";
import ChatProxy from "./ChatProxy";

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
        // cc.systemEvent.on(ServerConfig.chat_chat, this.onChat, this)
        cc.systemEvent.on(ServerConfig.chat_history, this.onChatHistory, this)
        cc.systemEvent.on(ServerConfig.chat_push, this.onChat, this)
    }

    protected onChat(data:any):void{
        console.log("onChat:",data)
        if (data.code == 0) {
            this._proxy.updateChat(data.msg);
            cc.systemEvent.emit("update_chat_history");
        }
    }


    protected onChatHistory(data:any):void{
        console.log("onChatHistory:",data)
        if (data.code == 0) {
            this._proxy.updateChatList(data.msg.msgs);
            cc.systemEvent.emit("update_chat_history");
        }
    }

    public onDestory(): void {
        cc.systemEvent.targetOff(this);
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
        ChatNetManager.getInstance().send(sendData);
    }

    public chatHistory(type:number = 0):void{
        let sendData: any = {
            name: ServerConfig.chat_history,
            msg: {
                type:type,
            }
        };
        ChatNetManager.getInstance().send(sendData);
    }

    
}