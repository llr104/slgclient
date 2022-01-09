import { _decorator, Component, ScrollView, Node, instantiate } from 'cc';
const { ccclass, property } = _decorator;

import UnionCommand from "./UnionCommand";
import { Member, Union } from "./UnionProxy";
import { MapCityData } from "../map/MapCityProxy";
import MapCommand from "../map/MapCommand";
import UnionMemberItemOpLogic from "./UnionMemberItemOpLogic";
import { EventMgr } from '../utils/EventMgr';

@ccclass('UnionMemberLogic')
export default class UnionMemberLogic extends Component {

    @property(ScrollView)
    memberView:ScrollView = null;

    @property(Node)
    disMissButton: Node = null;

    @property(Node)
    exitButton: Node = null;

    @property(Node)
    opNode: Node = null;

    protected _op: Node = null;

    protected onLoad():void{

        EventMgr.on("update_union_member",this.updateMember,this);
        EventMgr.on("kick_union_success",this.getMember,this);
        EventMgr.on("union_appoint",this.getMember,this);
        EventMgr.on("union_abdicate",this.getMember,this);
        EventMgr.on("clickUnionMemberItem",this.onClickItem,this);
        

    }

    protected onDestroy():void{
        EventMgr.targetOff(this);
    }

    protected click():void{
        if(this._op != null){
            this._op.active = false;
        }
    }

    protected onClickItem(menberData):void{
        if (this._op == null){
            var node = instantiate(this.opNode);
            node.parent = this.node;
            this._op = node;
        }
        this._op.active = true;
        this._op.getComponent(UnionMemberItemOpLogic).setData(menberData);
    }

    protected updateMember(data:any[]){

        let city:MapCityData = MapCommand.getInstance().cityProxy.getMyMainCity();
        let unionData:Union = UnionCommand.getInstance().proxy.getUnion(city.unionId);

        var comp = this.memberView.node.getComponent("ListLogic");
        var list:Member[] = UnionCommand.getInstance().proxy.getMemberList(unionData.id).concat();

        comp.setData(list);

        this.updateBtn();
    }

    protected updateBtn(){
        let city:MapCityData = MapCommand.getInstance().cityProxy.getMyMainCity();
        let unionData:Union = UnionCommand.getInstance().proxy.getUnion(city.unionId);
        if(unionData.getChairman().rid == city.rid){
            this.exitButton.active = false;
            this.disMissButton.active = true;
        }else{
            this.exitButton.active = true;
            this.disMissButton.active = false;
        }
    }

    protected getMember():void{
        let city:MapCityData = MapCommand.getInstance().cityProxy.getMyMainCity();
        let unionData:Union = UnionCommand.getInstance().proxy.getUnion(city.unionId);
        UnionCommand.getInstance().unionMember(unionData.id);
    }

    protected onEnable():void{
        this.updateBtn();
        this.getMember();
    }

    protected dismiss():void{
        UnionCommand.getInstance().unionDismiss();
    }

    protected exit():void{
        UnionCommand.getInstance().unionExit();
    }


}
