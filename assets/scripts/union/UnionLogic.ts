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
    mainNode:cc.Node = null;

    @property(cc.Node)
    lobbyNode:cc.Node = null;

    @property(cc.Node)
    memberNode:cc.Node = null;

    @property(cc.Node)
    applyNode:cc.Node = null;

    @property(cc.Label)
    nameLab:cc.Label = null;

    protected onLoad():void{
        this.visibleView();
        cc.systemEvent.on("open_my_union",this.openMyUnion,this);
        cc.systemEvent.on("dismiss_union_success",this.back,this);
        cc.systemEvent.on("close_union",this.onClickClose,this);
        cc.systemEvent.on("create_union_success",this.openMyUnion,this);
    }


    protected onDestroy():void{
        cc.systemEvent.targetOff(this);
    }

    protected onClickClose(): void {
        console.log("onClickClose");
        this.node.active = false;
    }

    protected onClickMember(): void {
        this.memberNode.active = true;
        this.mainNode.active = false;
    }

    protected onClickApply(): void {
        this.mainNode.active = false;
        this.applyNode.active = true;
    }

    protected openCreate():void{
        this.createNode.active = true;
    }


    protected visibleView():void{
        this.memberNode.active = this.createNode.active = this.lobbyNode.active = this.applyNode.active  = false;
    }

    protected openMyUnion():void{
        this.visibleView();
        this.mainNode.active = true
    }


    protected onEnable():void{
        
        let city:MapCityData = MapCommand.getInstance().cityProxy.getMyMainCity();
        if(city.unionId > 0){
            this.openMyUnion();
        }else{
            this.mainNode.active = false;
            this.lobbyNode.active = true;
        }
    }

    protected onDisable():void{
        this.visibleView();
    }


    protected back():void{
       this.openMyUnion();
    }

}
