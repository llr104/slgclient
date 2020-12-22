// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { MapCityData } from "../map/MapCityProxy";
import MapCommand from "../map/MapCommand";
import { Union } from "../union/UnionProxy";
import ChatCommand from "./ChatCommand";
import { ChatMsg } from "./ChatProxy";


const { ccclass, property } = cc._decorator;

@ccclass
export default class ChatLogic extends cc.Component {


    @property(cc.EditBox)
    editConent: cc.EditBox = null;

    @property(cc.ScrollView)
    chatView:cc.ScrollView = null;

    _type:number = 0;

    protected onLoad():void{
        cc.systemEvent.on("update_chat_history", this.updateChat, this);
        cc.systemEvent.on("unionChange", this.updateChat, this);
    }

    protected onEnable():void{
        console.log("onEnable")
        this.updateUnion();
        this.updateView();
    }

    protected updateUnion():void{
        let city:MapCityData = MapCommand.getInstance().cityProxy.getMyMainCity();
        if (city.unionId > 0){
            //加入联盟频道
            ChatCommand.getInstance().join(1, city.unionId);
        }else{
            ChatCommand.getInstance().exit(1, 0);
        }
    }

    protected updateChat(data:any[]){
        if(this._type == 0){
            var comp = this.chatView.node.getComponent("ListLogic");
            var list:ChatMsg[] = ChatCommand.getInstance().proxy.getWorldChatList();
            comp.setData(list);
        }else if (this._type == 1){
            var comp = this.chatView.node.getComponent("ListLogic");
            var list:ChatMsg[] = ChatCommand.getInstance().proxy.getUnionChatList();
            console.log("list:", list)
            comp.setData(list);
        }
    }

    protected onClickClose(): void {
        this.node.active = false;
    }

    public updateView():void{
        console.log("type:", this._type)
        ChatCommand.getInstance().chatHistory(this._type);
    }

    protected onClickChat(): void {
        if (this._type == 0){
            ChatCommand.getInstance().chat(this.editConent.string, this._type);
        }else if (this._type == 1){
            let city:MapCityData = MapCommand.getInstance().cityProxy.getMyMainCity();
            if (city.unionId > 0){
                ChatCommand.getInstance().chat(this.editConent.string, this._type);
            }
        }
        this.editConent.string = "";
    }

    protected onClickWorld(): void {
        this._type = 0;
        this.updateView();
    }

    protected onClickUnion(): void {
        this._type = 1;
        this.updateView();
    }
}
