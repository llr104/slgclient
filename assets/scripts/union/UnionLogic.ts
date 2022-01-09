// // Learn TypeScript:
// //  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// // Learn Attribute:
// //  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// // Learn life-cycle callbacks:
// //  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { _decorator, Component, Node, Label } from 'cc';
const { ccclass, property } = _decorator;

import { MapCityData } from "../map/MapCityProxy";
import MapCommand from "../map/MapCommand";
import { EventMgr } from '../utils/EventMgr';

@ccclass('UnionLogic')
export default class UnionLogic extends Component {
    @property(Node)
    createNode:Node | null = null;
    @property(Node)
    mainNode:Node | null = null;
    @property(Node)
    lobbyNode:Node | null = null;
    @property(Node)
    memberNode:Node | null = null;
    @property(Node)
    applyNode:Node | null = null;
    
    @property(Node)
    logNode:Node | null = null;
    @property(Label)
    nameLab:Label | null = null;
    protected onLoad():void{
        this.visibleView();
        EventMgr.on("open_my_union",this.openMyUnion,this);
        EventMgr.on("dismiss_union_success",this.exit,this);
        EventMgr.on("close_union",this.onClickClose,this);
        EventMgr.on("create_union_success",this.openMyUnion,this);
    }
    protected onDestroy():void{
        EventMgr.targetOff(this);
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
    protected onClickLog(): void {
        this.mainNode.active = false;
        this.logNode.active = true;
    }
    protected openCreate():void{
        this.createNode.active = true;
    }
    protected visibleView():void{
        this.memberNode.active =
        this.createNode.active =
        this.lobbyNode.active =
        this.applyNode.active =
        this.memberNode.active =
        this.logNode.active = false;
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
    protected exit():void{
        this.visibleView();
        this.lobbyNode.active = true
    }
}

