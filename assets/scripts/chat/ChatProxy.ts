

export class ChatMsg {
    rid: number = 0;
    nick_name: string = "";
    type:number = 0;
    msg:string = "";
    time:number = 0;
}


export default class ChatProxy {


    private _chatMsgList:ChatMsg[] = [];
    public clearData(): void {
    }



    public updateChatList(data:any[]):void{
        this._chatMsgList = [];
        for(var i = 0; i < data.length;i++){
            var chat = new ChatMsg();
            chat.msg = data[i].msg;
            chat.rid = data[i].rid;
            chat.type = data[i].type;
            chat.time = data[i].time;
            chat.nick_name = data[i].nickName
            this._chatMsgList.push(chat);
        }
    }


    public updateChat(data:any):void{
        var chat = new ChatMsg();
        chat.msg = data.msg;
        chat.rid = data.rid;
        chat.type = data.type;
        chat.time = data.time;
        chat.nick_name = data.nickName
        this._chatMsgList.push(chat);
    }


    public getChatList():ChatMsg[]{
        return this._chatMsgList;
    }
}