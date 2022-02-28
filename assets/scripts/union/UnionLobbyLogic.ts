import { _decorator, Component, ScrollView } from 'cc';
const { ccclass, property } = _decorator;

import UnionCommand from "./UnionCommand";
import { Union } from "./UnionProxy";
import { EventMgr } from '../utils/EventMgr';
import ListLogic from '../utils/ListLogic';
import { LogicEvent } from '../common/LogicEvent';

@ccclass('UnionLobbyLogic')
export default class UnionLobbyLogic extends Component {
    @property(ScrollView)
    scrollView:ScrollView | null = null;
    protected onLoad():void{
        EventMgr.on(LogicEvent.updateUnionList,this.updateUnion,this);
    }
    
    protected onDestroy():void{
        EventMgr.targetOff(this);
    }
    protected updateUnion(data:any[]){
        var comp = this.scrollView.node.getComponent(ListLogic);
        var list:Union[] = UnionCommand.getInstance().proxy.getUnionList();
        comp.setData(list);
    }
    protected onEnable():void{
 
        UnionCommand.getInstance().unionList();
    }
  
}

