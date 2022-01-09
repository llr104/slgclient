
import { _decorator } from 'cc';
import { NetEvent } from "./NetInterface";
import { EventMgr } from '../../utils/EventMgr';


export class NetTimerData {
    public name:string = "";
    public seq:number = 0;
    public timeId:number = 0;
}

export class NetTimer {
    private _tokens:any = null;
    private _tokenId:number = 0;
    public init(){
        this._tokens = new Map();
        this._tokenId = 0;
    }

    public schedule(data:any,delay:number = 0):void{
        
        var self = this;
        var token = this._tokenId++;
        var id = setTimeout(function() { self.handleTimeout(token); }, delay);

        var timerData = new NetTimerData();
        timerData.name = data.name;
        timerData.seq = data.seq;
        timerData.timeId = id;

        // console.log("NetTimer token size:",this._tokens.size,token)
        this._tokens.set(token,timerData);
    }


    private handleTimeout(id:number = 0):void{
        var data = this._tokens.get(id);
        if(data){
            EventMgr.emit(NetEvent.ServerTimeOut, data);
            this._tokens.delete(id);
        }
    }


    public cancel(data:any):void{
        if(data == null){
            return
        }
        var id = -1;
        if(typeof(data)=='object'){
            id = this.getKey(data);
        }else{
            id = data;
        }

        // console.log("NetTimer token id:",id)
        if(id >= 0){
            this._tokens.delete(id);
            clearTimeout(id);
            // console.log("NetTimer token cancel:",this._tokens.size)
        }

    }



    private getKey(data:any):number{
        var return_key = -1;
        this._tokens.forEach((value , key) =>{
            if(value.name == data.name && value.seq == data.seq){
                return_key = key;
            }    
        });

        return return_key;
    }


    public destroy():void{
        var self = this;
        this._tokens.forEach(function(key, value){
            self.cancel(key);
        });
        this._tokens.clear();
    }

}
