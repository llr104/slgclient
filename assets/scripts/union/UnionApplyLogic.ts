// // Learn TypeScript:
// //  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// // Learn Attribute:
// //  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// // Learn life-cycle callbacks:
// //  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { _decorator, Component, ScrollView } from 'cc';
const {ccclass, property} = _decorator;

import UnionCommand from "./UnionCommand";
import { Union } from "./UnionProxy";
import { MapCityData } from "../map/MapCityProxy";
import MapCommand from "../map/MapCommand";
import { EventMgr } from '../utils/EventMgr';

@ccclass('UnionApplyLogic')
export default class UnionApplyLogic extends Component {
    @property(ScrollView)
    applyView:ScrollView | null = null;
    protected onLoad():void{
        EventMgr.on("update_union_apply",this.updateApply,this);
        EventMgr.on("verify_union_success",this.getApply,this);
    }
    
    protected onDestroy():void{
        EventMgr.targetOff(this);
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

