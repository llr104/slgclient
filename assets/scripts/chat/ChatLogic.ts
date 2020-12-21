// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import ChatCommand from "./ChatCommand";
import { ChatMsg } from "./ChatProxy";


const { ccclass, property } = cc._decorator;

@ccclass
export default class ChatLogic extends cc.Component {


    @property(cc.EditBox)
    editConent: cc.EditBox = null;

    @property(cc.ScrollView)
    chatView:cc.ScrollView = null;

    protected onLoad():void{
        cc.systemEvent.on("update_chat_history",this.updateChat,this);
    }


    protected updateChat(data:any[]){
        var comp = this.chatView.node.getComponent("ListLogic");
        var list:ChatMsg[] = ChatCommand.getInstance().proxy.getChatList();
        comp.setData(list);

    }
    protected onClickClose(): void {
        this.node.active = false;
    }

    public updateView():void{
        ChatCommand.getInstance().chatHistory();
    }


    protected onClickChat(): void {
        ChatCommand.getInstance().chat(this.editConent.string)
    }

}
