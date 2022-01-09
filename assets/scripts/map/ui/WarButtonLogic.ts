import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

import MapUICommand from "./MapUICommand";
import { EventMgr } from '../../utils/EventMgr';

@ccclass('WarButtonLogic')
export default class WarButtonLogic extends Component {


    @property(Node)
    tipsNode:Node = null;

    protected onLoad():void{
        EventMgr.on("upate_war_report", this.updateView, this);
        this.updateView();
    }


    protected updateView():void{
        this.tipsNode.active = MapUICommand.getInstance().proxy.isReadNum()>0?true:false;
    }

    protected onDestroy():void{
        EventMgr.targetOff(this);
    }

    protected onClickClose(): void {
        this.node.active = false;
    }


}
