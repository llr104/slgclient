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

    protected onLoad():void{

        cc.systemEvent.on("update_union_member",this.updateMember,this);
        cc.systemEvent.on("kick_union_success",this.getMember,this);
    }


    protected updateMember(data:any[]){

        let city:MapCityData = MapCommand.getInstance().cityProxy.getMyMainCity();
        let unionData:Union = UnionCommand.getInstance().proxy.getUnion(city.unionId);

        var comp = this.memberView.node.getComponent("ListLogic");
        var list:Member[] = UnionCommand.getInstance().proxy.getMemberList(unionData.id).concat();

        list.forEach(item => {
            item.isMeChairMan = UnionCommand.getInstance().proxy.isMeChairman(unionData.id)
        })

        comp.setData(list);
    }


    protected getMember():void{
        let city:MapCityData = MapCommand.getInstance().cityProxy.getMyMainCity();
        let unionData:Union = UnionCommand.getInstance().proxy.getUnion(city.unionId);
        UnionCommand.getInstance().unionMember(unionData.id);
    }

    protected onEnable():void{
        this.getMember()
    }


}
