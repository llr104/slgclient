import { _decorator } from 'cc';
import { NetNode, NetConnectOptions } from "./NetNode";

export class NetManager {
    private static _instance: NetManager = null;
    protected _netNode: NetNode = null;
    public static getInstance(): NetManager {
        if (this._instance == null) {
        this._instance = new NetManager();
        }
        return this._instance;
    }
    constructor(){
        this._netNode = new NetNode();
        this._netNode.init();
    }
    
    public connect(options: NetConnectOptions) :void{
        this._netNode.connect(options);
    }

    public send(send_data: any, otherData:any = {},force: boolean = false) :void{
        if(send_data.seq == undefined){
            send_data.seq = 0;
        }
        
        this._netNode.send(send_data,otherData,force);
    }

    public close(code?: number, reason?: string):void {
        this._netNode.closeSocket(code, reason);
    }

    public changeConnect(options: NetConnectOptions):void {
        this._netNode.changeConect(options);
    }
    public tryConnet():void{
        this._netNode.tryConnet();
    }
}
