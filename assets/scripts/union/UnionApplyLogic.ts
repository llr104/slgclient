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

const {ccclass, property} = cc._decorator;

@ccclass
export default class UnionApplyLogic extends cc.Component {

    @property(cc.ScrollView)
    applyView:cc.ScrollView = null;

    protected onLoad():void{
        cc.systemEvent.on("update_union_apply",this.updateApply,this);
        cc.systemEvent.on("verify_union_success",this.getApply,this);
    }

    
    protected onDestroy():void{
        cc.systemEvent.targetOff(this);
    }

    protected updateApply(data:any[]){
        var comp = this.applyView.node.getComponent("ListLogic");
        comp.setData(data?data:[]);
    }


    protected getApply():void{
        let city:MapCityData = MapCommand.getInstance().cityProxy.getMyMainCity();
        let unionData:Union = UnionCommand.getInstance().proxy.getUnion(city.unionId);
        if(unionData.isMajor(city.rid)){
            UnionCommand.getInstance().unionApplyList(unionData.id);
        }
    }


    protected onEnable():void{
        console.log("getApply");
        this.getApply()
    }
}
