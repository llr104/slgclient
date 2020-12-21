// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import UnionCommand from "./UnionCommand";
import { Member, Union } from "./UnionProxy";
import { MapCityData } from "../map/MapCityProxy";
import MapCommand from "../map/MapCommand";


const { ccclass, property } = cc._decorator;

@ccclass
export default class UnionMemberLogic extends cc.Component {

    @property(cc.ScrollView)
    memberView:cc.ScrollView = null;

    @property(cc.Node)
    disMissButton: cc.Node = null;

    @property(cc.Node)
    exitButton: cc.Node = null;

    @property(cc.Node)
    opNode: cc.Node = null;

    protected _op: cc.Node = null;

    protected onLoad():void{

        cc.systemEvent.on("update_union_member",this.updateMember,this);
        cc.systemEvent.on("kick_union_success",this.getMember,this);
        cc.systemEvent.on("union_appoint",this.getMember,this);
        cc.systemEvent.on("union_abdicate",this.getMember,this);
        cc.systemEvent.on("clickUnionMemberItem",this.onClickItem,this);
        

    }

    protected onDestroy():void{
        cc.systemEvent.targetOff(this);
    }

    protected click():void{
        if(this._op != null){
            this._op.active = false;
        }
    }

    protected onClickItem(menberData):void{
        if (this._op == null){
            var node = cc.instantiate(this.opNode);
            node.parent = this.node;
            this._op = node;
        }
        this._op.active = true;
        this._op.getComponent("UnionMemberItemOpLogic").setData(menberData);
    }

    protected updateMember(data:any[]){

        let city:MapCityData = MapCommand.getInstance().cityProxy.getMyMainCity();
        let unionData:Union = UnionCommand.getInstance().proxy.getUnion(city.unionId);

        var comp = this.memberView.node.getComponent("ListLogic");
        var list:Member[] = UnionCommand.getInstance().proxy.getMemberList(unionData.id).concat();

        comp.setData(list);
    }


    protected getMember():void{
        let city:MapCityData = MapCommand.getInstance().cityProxy.getMyMainCity();
        let unionData:Union = UnionCommand.getInstance().proxy.getUnion(city.unionId);
        UnionCommand.getInstance().unionMember(unionData.id);
    }

    protected onEnable():void{
        let city:MapCityData = MapCommand.getInstance().cityProxy.getMyMainCity();
        let unionData:Union = UnionCommand.getInstance().proxy.getUnion(city.unionId);
        if(unionData.getChairman().rid == city.rid){
            this.exitButton.active = false;
            this.disMissButton.active = true;
        }else{
            this.exitButton.active = true;
            this.disMissButton.active = false;
        }
        
        this.getMember()
    }

    protected dismiss():void{
        UnionCommand.getInstance().unionDismiss();
    }

    protected exit():void{
        UnionCommand.getInstance().unionExit();
    }


}
