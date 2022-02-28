

import { _decorator, Component, ScrollView } from 'cc';
const {ccclass, property} = _decorator;

import UnionCommand from "./UnionCommand";
import { Union } from "./UnionProxy";
import { MapCityData } from "../map/MapCityProxy";
import MapCommand from "../map/MapCommand";
import { EventMgr } from '../utils/EventMgr';
import { LogicEvent } from '../common/LogicEvent';
import ListLogic from '../utils/ListLogic';

@ccclass('UnionLogLogic')
export default class UnionLogLogic extends Component {
    @property(ScrollView)
    logView:ScrollView | null = null;
    protected onLoad():void{
        EventMgr.on(LogicEvent.unionLog,this.updateLog,this);
    }
    
    protected onDestroy():void{
        EventMgr.targetOff(this);
    }
    protected updateLog(data:any[]){

        var comp = this.logView.node.getComponent(ListLogic);
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

