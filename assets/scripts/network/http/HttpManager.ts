import { _decorator } from 'cc';
import { HttpInvoke,HttpInvokeType } from "./HttpInvoke";

export class HttpManager {
    private static _instance: HttpManager = null;
    public static getInstance(): HttpManager {
        if (this._instance == null) {
            this._instance = new HttpManager();
        }
        return this._instance;
    }


    protected _url:string = "";
    public setWebUrl(url:string):void{
        if(this._url == "" || this._url != url){
            this._url = url;
        } 
    }


    public doGet(name:string,apiUrl:string,params:any,otherData:any = null):void{
        var invoke = new HttpInvoke();
        invoke.init(name,otherData);
        invoke.doSend(this._url + apiUrl,params,HttpInvokeType.GET);
    }



    public doPost(name:string,apiUrl:string,params:any,otherData:any = null):void{
        var invoke = new HttpInvoke();
        invoke.init(name,otherData);
        invoke.doSend(this._url + apiUrl,params,HttpInvokeType.POST);
    }
}
