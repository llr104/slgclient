// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import UnionCommand from "../../union/UnionCommand";
import { MapCityData } from "../MapCityProxy";
import MapCommand from "../MapCommand";


const { ccclass, property } = cc._decorator;

@ccclass
export default class WarButtonLogic extends cc.Component {


    @property(cc.Node)
    tipsNode:cc.Node = null;

    protected onLoad():void{
        cc.systemEvent.on("update_union_apply", this.updateView, this);
        this.tipsNode.active = false;
    }


    protected updateView():void{
        let city:MapCityData = MapCommand.getInstance().cityProxy.getMyMainCity();
        let cnt = UnionCommand.getInstance().proxy.getApplyCnt(city.unionId);
        this.tipsNode.active = cnt > 0;
    }

    protected onDestroy():void{
        cc.systemEvent.targetOff(this);
    }

    protected onClickClose(): void {
        this.node.active = false;
    }


}
