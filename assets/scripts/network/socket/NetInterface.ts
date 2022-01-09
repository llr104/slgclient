
export type NetData = (string | ArrayBufferLike | Blob | ArrayBufferView);

export class RequestObject {
    public json: any   = null;           // 请求的json
    public rspName: string = "";       // 接口名
    public autoReconnect: number = 0;  // -1 永久重连，0不自动重连，其他正整数为自动重试次数
    public seq:number = 0;             // 消息的序号
    public sended:boolean = false;        // 是否发送
    public otherData:any = {};
    public startTime:number = 0

    public destroy():void{
        this.json = null;
        this.rspName = "";
        this.autoReconnect = 0;
        this.seq = 0;
        this.sended = false;
        this.otherData = {};
        this.startTime = 0;
    }
}



// Socket接口
export interface ISocket {
    onConnected: (event) => void;           // 连接回调
    onMessage: (msg: NetData) => void;      // 消息回调
    onJsonMessage: (msg: NetData) => void;      // 消息回调
    onError: (event) => void;               // 错误回调
    onClosed: (event) => void;              // 关闭回调
    
    connect(options: any);                  // 连接接口
    send(buffer: NetData);                  // 数据发送接口
    close(code?: number, reason?: string);  // 关闭接口
}


// 请求对象
export class NetEvent {
    public static ServerTimeOut:string = "ServerTimeOut";
    public static ServerConnected:string = "ServerConnected";
    public static ServerHandShake:string = "ServerHandShake";
    public static ServerCheckLogin:string = "ServerCheckLogin";
    public static ServerRequesting:string = "ServerRequesting";
    public static ServerRequestSucess:string = "ServerRequestSucess";
}
