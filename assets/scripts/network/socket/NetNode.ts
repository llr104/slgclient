
import { RequestObject, NetEvent } from "./NetInterface";
import { NetTimer } from "./NetTimer";
import { WebSock } from "./WebSock";
import { EventMgr } from "../../utils/EventMgr";


export enum NetTipsType {
    Connecting,
    ReConnecting,
    Requesting,
}

export enum NetNodeState {
    Closed,                     // 已关闭
    Connecting,                 // 连接中
    Checking,                   // 验证中
    Working,                    // 可传输数据
}


export enum NetNodeType {
    BaseServer,                     //主要服务器
    ChatServer,                     //聊天服务器
}
 


export interface NetConnectOptions {
    host?: string,              // 地址
    port?: number,              // 端口
    url?: string,               // url，与地址+端口二选一
    autoReconnect?: number,     // -1 永久重连，0不自动重连，其他正整数为自动重试次数
    type?:NetNodeType,          //服务器类型
}

export class NetNode {
    protected _connectOptions: NetConnectOptions = null;
    protected _autoReconnect: number = 0;
    protected _autoReconnectMax: number = 3;
    protected _state: NetNodeState = NetNodeState.Closed;                   // 节点当前状态
    protected _socket: WebSock = null;                                      // Socket对象（可能是原生socket、websocket、wx.socket...)
    protected _timer:NetTimer = null;


    protected _keepAliveTimer: any = null;                                  // 心跳定时器
    protected _reconnectTimer: any = null;                                  // 重连定时器
    protected _heartTime: number = 10*1000;                                 // 心跳间隔
    protected _receiveTime: number = 15*1000;                               // 多久没收到数据断开
    protected _reconnetTimeOut: number = 2*1000;                            // 重连间隔
    protected _requests: RequestObject[] = Array<RequestObject>();          // 请求列表
    protected _maxSeqId :number = 1000000;
    protected _seqId :number = 1;
    protected _invokePool:any = [];

    /********************** 网络相关处理 *********************/
    public init() {
        console.log(`NetNode init socket`);
        this._socket = new WebSock();
        this.initSocket();
        this._timer = new NetTimer();
        this.initTimer();
        this._invokePool = [];
        
    }

    public connect(options: NetConnectOptions): boolean {
        console.log(`NetNode connect socket:`,options);
        if (this._socket && this._state == NetNodeState.Closed) {
            this._state = NetNodeState.Connecting;
            if (!this._socket.connect(options)) {
                this.updateNetTips(NetTipsType.Connecting, false);
                return false;
            }

            if (this._connectOptions == null) {
                options.autoReconnect = options.autoReconnect;
            }
            this._connectOptions = options;
            this.updateNetTips(NetTipsType.Connecting, true);
            return true;
        }
        return false;
    }


    /**
     * 更换线路
     * @param options 
     */
    public changeConect(options: NetConnectOptions){
        if(options == this._connectOptions){
            return;
        }

        if(this._state != NetNodeState.Closed){
            this.closeSocket();
        }
        this.connect(options);
    }

    protected initSocket() {
        this._autoReconnect = this._autoReconnectMax;
        this._socket.onConnected = (event) => { this.onConnected(event) };
        this._socket.onJsonMessage = (msg) => { this.onMessage(msg) };
        this._socket.onError = (event) => { this.onError(event) };
        this._socket.onClosed = (event) => { this.onClosed(event) };
        this._socket.onGetKey = () => { this.onGetKey() };

        EventMgr.on(NetEvent.ServerHandShake, this.onChecked, this);
    }


    protected onGetKey(){
        this._state = NetNodeState.Working;

        // if(this._connectOptions.type == NetNodeType.BaseServer){
            
        // }else{
        //     this.onChecked();
        // }

        EventMgr.emit(NetEvent.ServerCheckLogin);
        
    }


    protected initTimer(){
        this._timer.init();
        
        EventMgr.on(NetEvent.ServerTimeOut, this.onTimeOut, this);
    }

    protected onTimeOut(msg:any){
        console.log("NetNode onTimeOut!",msg)
        //超时删除 请求队列
        for (var i = 0; i < this._requests.length;i++) {
            let req = this._requests[i];
            if(msg.name == req.rspName && msg.seq == req.seq){
                this._requests.splice(i, 1);
                this.destroyInvoke(req);
                i--;

            }       
        }

    }

    protected updateNetTips(tipsType: NetTipsType, isShow: boolean) {
        if (tipsType == NetTipsType.Requesting) {
            // EventMgr.emit(NetEvent.ServerRequesting, isShow);

        } else if (tipsType == NetTipsType.Connecting) {

        } else if (tipsType == NetTipsType.ReConnecting) {

        }
    }

    // 网络连接成功
    protected onConnected(event) {
        console.log("NetNode onConnected!")
        this._autoReconnect = this._autoReconnectMax;

        this.clearTimer();
        // 启动心跳
        this.resetHearbeatTimer();

        // EventMgr.emit(NetEvent.ServerConnected);
    }

    // 连接验证成功，进入工作状态
    protected onChecked() {
        console.log("NetNode onChecked!")
        
        // 关闭连接或重连中的状态显示
        this.updateNetTips(NetTipsType.Connecting, false);
        this.updateNetTips(NetTipsType.ReConnecting, false);

        if (this._requests.length > 0) {
            for (var i = 0; i < this._requests.length;i++) {
                let req = this._requests[i];
                if(req.sended == false){
                    this.socketSend(req);
                }

            }
            // 如果还有等待返回的请求，启动网络请求层
        }
    }

    // 接收到一个完整的消息包
    protected onMessage(msg): void {
        // console.log(`NetNode onMessage msg ` ,msg);
        
        if(msg){

             // 接受到数据，重新定时收数据计时器
            //推送
            if(msg.seq == 0){
                EventMgr.emit(msg.name, msg);
                // console.log("all_push:",msg.name, msg);
            }else{
                this.cannelMsgTimer(msg);

                // console.log("this._requests.length:",this._requests.length)
                for (var i = 0; i < this._requests.length;i++) {
                    let req = this._requests[i];
                    if(msg.name == req.rspName && msg.seq == req.seq && req.sended == true){
                        this._requests.splice(i, 1);
                        i--;
                        // console.log("返回:",msg.name,"耗时:",new Date().getTime() - req.startTime)
                        EventMgr.emit(msg.name, msg , req.otherData);
                        this.destroyInvoke(req);
                        EventMgr.emit(NetEvent.ServerRequestSucess,msg);
                    }       
                }

            }
           
        }
    }

    protected onError(event) {
        console.log("onError:",event);

        //出错后清空定时器 那后断开服务 尝试链接
        this.clearTimer();
        this.restReq();
        this.tryConnet();
    }

    protected onClosed(event) {
        console.log("onClosed:",event);

        //出错后
        this.clearTimer();
        this.tryConnet();
    }

    protected restReq(){
        for (var i = 0; i < this._requests.length;i++) {
            let req = this._requests[i];
            req.sended = false;            
        }
    }

    /**
     * 重连
     */
    public tryConnet(){
        console.log("tryConnet",this._autoReconnect)
        if (this.isAutoReconnect()) {
            this.updateNetTips(NetTipsType.ReConnecting, true);

            
            this._socket.close();
            this._state = NetNodeState.Closed;

            this._reconnectTimer = setTimeout(() => {
                console.log("NetNode tryConnet!")
                this.connect(this._connectOptions);
                if (this._autoReconnect > 0) {
                    this._autoReconnect -= 1;
                }


            }, this._reconnetTimeOut);
        } else {
            this._state = NetNodeState.Closed;
        }

    }

    // 只是关闭Socket套接字（仍然重用缓存与当前状态）
    public closeSocket(code?: number, reason?: string) {
        this.clearTimer();
        this._requests.length = 0;
        this._seqId = 1;
        this._autoReconnect = 0;

        if (this._socket) {
            this._socket.close(code, reason);
        } else {
            this._state = NetNodeState.Closed;
        }
    }




    public send(send_data:any,otherData:any,force: boolean = false):void{
   
        var data = this.createInvoke();//new RequestObject();
        data.json = send_data;
        data.rspName = send_data.name;
        data.otherData = otherData;

        this.sendPack(data,force);
    }

    // 发起请求，如果当前处于重连中，进入缓存列表等待重连完成后发送
    public sendPack(obj: RequestObject, force: boolean = false): boolean {
        if (this._state == NetNodeState.Working || force) {
            this.socketSend(obj);
            this._requests.push(obj);
        } 
        
        else if (this._state == NetNodeState.Checking ||
            this._state == NetNodeState.Connecting) {
            this._requests.push(obj);
        } 
        
        else if(this._state == NetNodeState.Closed){
            this.connect(this._connectOptions);
            this._requests.push(obj);
        }
        
        else {
            console.error("NetNode request error! current state is " + this._state);
        }
        return false;
    }


    /**
     * 打包发送
     * @param obj 
     */
    public socketSend(obj:RequestObject){
        obj.seq = obj.json.seq = this._seqId;
        obj.startTime = new Date().getTime()
        this._socket.packAndSend(obj.json);
        this._seqId+=1;
        obj.sended = true;
        this._timer.schedule(obj.json,this._receiveTime);
    }


    /**
     * 心跳
     */
    public getHearbeat(){
        var obj = this.createInvoke();//new RequestObject();
        obj.json = {name:"heartbeat",msg:{ctime:new Date().getTime()},seq:0};
        obj.rspName = "heartbeat";
        obj.seq = 0;
        return obj;
        
    }
    

    /********************** 心跳、超时相关处理 *********************/
    protected cannelMsgTimer(data:any = null) {
        this._timer.cancel(data);
    }

    protected resetHearbeatTimer() {
        if (this._keepAliveTimer !== null) {
            clearInterval(this._keepAliveTimer);
        }

        this._keepAliveTimer = setInterval(() => {
            this.sendPack(this.getHearbeat());
        }, this._heartTime);
    }

    protected clearTimer() {
        if (this._keepAliveTimer !== null) {
            clearTimeout(this._keepAliveTimer);
        }
        if (this._reconnectTimer !== null) {
            clearTimeout(this._reconnectTimer);
        }
        this._timer.destroy();
    }

    public isAutoReconnect() {
        return this._autoReconnect != 0;
    }

    public rejectReconnect() {
        this._autoReconnect = 0;
        this.clearTimer();
    }






    protected createInvoke():RequestObject{
        // console.log("createInvoke_invokePool :",this._invokePool.length)
        if (this._invokePool.length > 0) {
            return this._invokePool.shift();
        }
        return new RequestObject();
    }

    protected destroyInvoke(invoke:RequestObject):void {
        invoke.destroy();
        this._invokePool.push(invoke);
        // console.log("destroyInvoke_invokePool :",this._invokePool.length)
    }
}
