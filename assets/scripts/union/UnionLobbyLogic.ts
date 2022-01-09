import { _decorator, Component, ScrollView } from 'cc';
const { ccclass, property } = _decorator;

import UnionCommand from "./UnionCommand";
import { Union } from "./UnionProxy";
import { EventMgr } from '../utils/EventMgr';

@ccclass('UnionLobbyLogic')
export default class UnionLobbyLogic extends Component {
    @property(ScrollView)
    scrollView:ScrollView | null = null;
    private _isFrist:boolean = false;
    protected onLoad():void{
        EventMgr.on("update_union_list",this.updateUnion,this);
    }
    
    protected onDestroy():void{
        EventMgr.targetOff(this);
    }
    protected updateUnion(data:any[]){
        var comp = this.scrollView.node.getComponent("ListLogic");
        var list:Union[] = UnionCommand.getInstance().proxy.getUnionList();
        comp.setData(list);
    }
    protected onEnable():void{
        this._isFrist = true;
        UnionCommand.getInstance().unionList();
    }
    protected onDisable():void{
        this._isFrist = false;
    }
}

