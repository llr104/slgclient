import { NetNode, NetConnectOptions } from "./NetNode";
import { RequestObject } from "./NetInterface";

/*
*   网络节点管理类
*
*/

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


    // 调用Node连接
    public connect(options: NetConnectOptions) :void{
        this._netNode.connect(options);
    }

    // 调用Node发送
    public send(send_data: any, otherData:any = {},force: boolean = false) :void{

        if(send_data.seq == undefined){
            send_data.seq = 0;
        }

        var data = new RequestObject();
        data.json = send_data;
        data.rspName = send_data.name;
        data.otherData = otherData;

        this._netNode.send(data,force);
    }


    // 调用Node关闭
    public close(code?: number, reason?: string):void {
        this._netNode.closeSocket(code, reason);
    }

    // 调用切换线路
    public changeConnect(options: NetConnectOptions):void {
        this._netNode.changeConect(options);
    }

    public tryConnet():void{
        this._netNode.tryConnet();
    }
}