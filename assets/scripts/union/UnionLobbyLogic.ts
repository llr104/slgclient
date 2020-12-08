// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { MapCityData } from "../map/MapCityProxy";
import MapCommand from "../map/MapCommand";
import UnionCommand from "./UnionCommand";
import { Union } from "./UnionProxy";


const { ccclass, property } = cc._decorator;

@ccclass
export default class UnionLobbyLogic extends cc.Component {

    @property(cc.ScrollView)
    scrollView:cc.ScrollView = null;

    private _isFrist:boolean = false;

    protected onLoad():void{
        cc.systemEvent.on("update_union_list",this.updateUnion,this);
    }


    protected updateUnion(data:any[]){
        var comp = this.scrollView.node.getComponent("ListLogic");
        var list:Union[] = UnionCommand.getInstance().proxy.getUnionList();
        comp.setData(list);

        let city:MapCityData = MapCommand.getInstance().cityProxy.getMyMainCity();
        if(city.unionId > 0 && this._isFrist){
            this._isFrist = false;
            cc.systemEvent.emit("open_my_union",UnionCommand.getInstance().proxy.getUnion(city.unionId))
        }
        
    }

    protected onEnable():void{
        this._isFrist = true;
        UnionCommand.getInstance().unionList();
    }

    protected onDisable():void{
        this._isFrist = false;
    }
}
