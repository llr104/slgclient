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
export default class UnionLogic extends cc.Component {

    @property(cc.Node)
    createNode:cc.Node = null;


    @property(cc.Node)
    lobbyNode:cc.Node = null;

    @property(cc.Node)
    myNode:cc.Node = null;

    protected onLoad():void{
        this.visibleView();
        cc.systemEvent.on("open_my_union",this.openMyUnion,this);
        cc.systemEvent.on("dismiss_union_success",this.back,this);
        cc.systemEvent.on("close_union",this.onClickClose,this);+
        cc.systemEvent.on("update_union_list",this.updateUnion,this);
    }




    protected onDestroy():void{
        cc.systemEvent.targetOff(this);
    }

    protected onClickClose(): void {
        this.node.active = false;
    }

    protected openCreate():void{
        this.createNode.active = true;
    }


    protected visibleView():void{
        this.myNode.active = this.createNode.active = this.lobbyNode.active = false;
    }

    protected openMyUnion(data:any):void{
        this.visibleView();
        var com = this.myNode.getComponent("UnionMyLogic");
        if(com){
            this.myNode.active = true;
            com.setData(data);
        }


    }

    protected updateUnion():void{
        let city:MapCityData = MapCommand.getInstance().cityProxy.getMyMainCity();
        let unionData:Union = UnionCommand.getInstance().proxy.getUnion(city.unionId)
        if(city.unionId > 0 && unionData){
            this.openMyUnion(unionData);
        }else{
            this.lobbyNode.active = true;
        }
    }

    protected getUnionList():void{

    }

    protected onEnable():void{
        UnionCommand.getInstance().unionList();
    }

    protected onDisable():void{
        this.visibleView();
    }


    protected back():void{
        this.visibleView();
        this.lobbyNode.active = true;
    }

}
