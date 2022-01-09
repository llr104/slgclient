import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

import UnionCommand from "../../union/UnionCommand";
import { MapCityData } from "../MapCityProxy";
import MapCommand from "../MapCommand";
import { EventMgr } from '../../utils/EventMgr';

@ccclass('UnionButtonLogic')
export default class WarButtonLogic extends Component {


    @property(Node)
    tipsNode:Node = null;

    protected onLoad():void{
        EventMgr.on("update_union_apply", this.updateView, this);
        this.tipsNode.active = false;
    }


    protected updateView():void{
        let city:MapCityData = MapCommand.getInstance().cityProxy.getMyMainCity();
        let cnt = UnionCommand.getInstance().proxy.getApplyCnt(city.unionId);
        this.tipsNode.active = cnt > 0;
    }

    protected onDestroy():void{
        EventMgr.targetOff(this);
    }

    protected onClickClose(): void {
        this.node.active = false;
    }


}
