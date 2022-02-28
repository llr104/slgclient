
import { _decorator, Component, Node, Label } from 'cc';
import { AudioManager } from '../common/AudioManager';
import { LogicEvent } from '../common/LogicEvent';
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
        EventMgr.on(LogicEvent.openMyUnion,this.openMyUnion,this);
        EventMgr.on(LogicEvent.dismissUnionSuccess,this.onDismiss,this);
        EventMgr.on(LogicEvent.closeUnion,this.closeUnion,this);
        EventMgr.on(LogicEvent.createUnionSuccess,this.openMyUnion,this);
    }
    protected onDestroy():void{
        EventMgr.targetOff(this);
    }
    protected onClickClose(): void {
        console.log("onClickClose");
        AudioManager.instance.playClick();
        this.closeUnion();
    }
    protected onClickMember(): void {
        AudioManager.instance.playClick();
        this.memberNode.active = true;
        this.mainNode.active = false;
    }
    protected onClickApply(): void {
        AudioManager.instance.playClick();
        this.mainNode.active = false;
        this.applyNode.active = true;
    }
    protected onClickLog(): void {
        AudioManager.instance.playClick();
        this.mainNode.active = false;
        this.logNode.active = true;
    }
    protected openCreate():void{
        AudioManager.instance.playClick();
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

    protected closeUnion(){
        this.node.active = false;
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
        AudioManager.instance.playClick();
        this.openMyUnion();
    }
    protected onDismiss():void{
        this.visibleView();
        this.lobbyNode.active = true
    }
}

