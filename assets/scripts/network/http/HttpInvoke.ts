import { NetEvent } from "../socket/NetInterface";

export enum HttpInvokeType {
    GET,
    POST
}


export class HttpInvoke {
    
    protected _receiveTime: number = 15000;               // 多久没收到数据断开
    protected _name:string = "";
    protected _otherData:any = null;


    public init(name:string,_otherData:any = null):void{
        this._name = name;
        this._otherData = _otherData;
    }



    private onComplete(data:any):void{
        var json = {};
        if(data){
            try {
                json = JSON.parse(data.responseText);
            } catch (e) {
                console.log("onComplete--e:",e)
            }
        }
        cc.systemEvent.emit(this._name, json,this._otherData);
        cc.systemEvent.emit(NetEvent.ServerRequestSucess,json);
        
    }


    public doSend(url:string,params:any,type:HttpInvokeType):void{
        var self = this;
        let xhr = new XMLHttpRequest();
        xhr.timeout = this._receiveTime;


        console.log("doSend:",url,params,type)
        
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4) {
                console.log("onreadystatechange:",xhr.responseText);
                if (xhr.status >= 200 && xhr.status < 400) {
                    self.onComplete(xhr);
                } else {
                    self.onComplete(null);
                }
            }

        };
        xhr.ontimeout = function () {
            console.log("xhr.ontimeout");
            self.onComplete(null);
        };
        xhr.onerror = function (e) {
            console.log("xhr.onerror:", xhr.readyState, xhr.status, e);
            self.onComplete(null);
        };
        
        
        if(type == HttpInvokeType.GET){
            url +="?"+ params;
            xhr.open("GET",url , true);
            xhr.send();
        }else if(type == HttpInvokeType.POST){
            xhr.open("POST", url, true);
            xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded;");
            xhr.send(params);
        }
    }
}