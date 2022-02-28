import { _decorator } from 'cc';
import { NetEvent } from "../socket/NetInterface";
import { EventMgr } from '../../utils/EventMgr';


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
        EventMgr.emit(this._name, json,this._otherData);
        EventMgr.emit(NetEvent.ServerRequestSucess,json);
        
    }


    public doSend(url:string,params:any,type:HttpInvokeType):Promise<any>{
       
        let xhr = new XMLHttpRequest();
        xhr.timeout = this._receiveTime;
        var self = this;
        
        let p = new Promise(function(resolve, reject){
            
            xhr.onreadystatechange = function () {
                if (xhr.readyState == 4) {
                    console.log("onreadystatechange:",xhr);
                    if (xhr.status >= 200 && xhr.status < 400) {
                        self.onComplete(xhr);
                        resolve(xhr);
                    } else {
                        self.onComplete(null);
                        console.log("onreadystatechange 1111");
                        resolve(xhr);
                    }
                }
    
            };
            xhr.ontimeout = function () {
                console.log("xhr.ontimeout");
                self.onComplete(null);
                resolve(null);
            };
            xhr.onerror = function (e) {
                console.log("xhr.onerror:", xhr.readyState, xhr.status, e);
                self.onComplete(null);
                resolve(null);
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
        });
         
       
        return p;

    }
}
