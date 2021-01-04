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
export default class UnionLogLogic extends cc.Component {

    @property(cc.ScrollView)
    logView:cc.ScrollView = null;

    protected onLoad():void{
        cc.systemEvent.on("union_log",this.updateLog,this);
    }

    
    protected onDestroy():void{
        cc.systemEvent.targetOff(this);
    }

    protected updateLog(data:any[]){
        console.log("updateLog");
        var comp = this.logView.node.getComponent("ListLogic");
        comp.setData(data?data:[]);
    }


    protected getLog():void{
        let city:MapCityData = MapCommand.getInstance().cityProxy.getMyMainCity();
        let unionData:Union = UnionCommand.getInstance().proxy.getUnion(city.unionId);
        if(unionData.isMajor(city.rid)){
            UnionCommand.getInstance().unionLog();
        }
    }


    protected onEnable():void{
        console.log("getLog");
        this.getLog()
    }
}
