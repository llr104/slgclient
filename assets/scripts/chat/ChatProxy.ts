import { _decorator } from 'cc';

export class ChatMsg {
    rid: number = 0;
    nick_name: string = "";
    type:number = 0;
    msg:string = "";
    time:number = 0;
}


export default class ChatProxy {


    private _worldMsgList:ChatMsg[] = [];
    private _unionMsgList:ChatMsg[] = [];
    
    public clearData(): void {

    }

    public updateWorldChatList(data:any[]):void{
        this._worldMsgList = [];
        for(var i = 0; i < data.length;i++){
            var chat = new ChatMsg();
            chat.msg = data[i].msg;
            chat.rid = data[i].rid;
            chat.type = data[i].type;
            chat.time = data[i].time;
            chat.nick_name = data[i].nickName
            this._worldMsgList.push(chat);
        }
    }


    public updateUnionChatList(data:any[]):void{
        this._unionMsgList = [];
        for(var i = 0; i < data.length;i++){
            var chat = new ChatMsg();
            chat.msg = data[i].msg;
            chat.rid = data[i].rid;
            chat.type = data[i].type;
            chat.time = data[i].time;
            chat.nick_name = data[i].nickName
            this._unionMsgList.push(chat);
        }
    }


    public updateWorldChat(data:any):void{
        var chat = new ChatMsg();
        chat.msg = data.msg;
        chat.rid = data.rid;
        chat.type = data.type;
        chat.time = data.time;
        chat.nick_name = data.nickName
        this._worldMsgList.push(chat);
    }

    public updateUnionChat(data:any):void{
        var chat = new ChatMsg();
        chat.msg = data.msg;
        chat.rid = data.rid;
        chat.type = data.type;
        chat.time = data.time;
        chat.nick_name = data.nickName
        this._unionMsgList.push(chat);
    }


    public getWorldChatList():ChatMsg[]{
        return this._worldMsgList;
    }

    public getUnionChatList():ChatMsg[]{
        return this._unionMsgList;
    }
}
