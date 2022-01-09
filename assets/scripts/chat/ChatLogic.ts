

import { _decorator, Component, EditBox, ScrollView } from 'cc';
const { ccclass, property } = _decorator;

import { MapCityData } from "../map/MapCityProxy";
import MapCommand from "../map/MapCommand";
import ChatCommand from "./ChatCommand";
import { ChatMsg } from "./ChatProxy";
import ListLogic from '../utils/ListLogic';
import { EventMgr } from '../utils/EventMgr';

@ccclass('ChatLogic')
export default class ChatLogic extends Component {

    @property(EditBox)
    editConent: EditBox = null;

    @property(ScrollView)
    chatView:ScrollView = null;

    _type:number = 0;

    protected onLoad():void{
        EventMgr.on("update_chat_history", this.updateChat, this);
        EventMgr.on("unionChange", this.updateChat, this);
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
            var comp = this.chatView.node.getComponent(ListLogic);
            var list:ChatMsg[] = ChatCommand.getInstance().proxy.getWorldChatList();
            comp.setData(list);
        }else if (this._type == 1){
            var comp = this.chatView.node.getComponent(ListLogic);
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
