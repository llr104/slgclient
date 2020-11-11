
/*
*   网络相关接口定义
*   
*   2019-10-8 by 宝爷
*/

export type NetData = (string | ArrayBufferLike | Blob | ArrayBufferView);


// 回调对象


// 请求对象
export class RequestObject {
    json: any             // 请求的json
    rspName: string = "";       // 接口名
    autoReconnect: number = 0;  // -1 永久重连，0不自动重连，其他正整数为自动重试次数
    seq:number = 0;             // 消息的序号
    sended:boolean = false;        // 是否发送
    otherData:any = {};
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
}