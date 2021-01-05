import DateUtil from "../../utils/DateUtil";
import { MapBuildData } from "../MapBuildProxy";
import MapCommand from "../MapCommand";
import { MapResType } from "../MapProxy";

const { ccclass, property } = cc._decorator;

@ccclass
export default class BuildLogic extends cc.Component {
    @property(cc.Sprite)
    spr: cc.Sprite = null;

    @property(cc.SpriteAtlas)
    buildAtlas: cc.SpriteAtlas = null;

    @property(cc.Node)
    giveUpNode: cc.Node = null;

    @property(cc.Label)
    giveUpLabTime: cc.Label = null;

    protected _data: MapBuildData = null;

    protected onLoad(): void {
        
    }

    protected onDestroy(): void {
        this._data = null;
    }

    protected onEnable():void {
        this.giveUpNode.active = false;
        cc.systemEvent.on("unionChange", this.onUnionChange, this);
    }

    protected onDisable():void {
        cc.systemEvent.targetOff(this);
    }

    protected onUnionChange(rid: number, unionId: number, parentId: number): void {
        if (this._data.rid == rid ){
            this._data.unionId = unionId;
            this._data.parentId = parentId;
        }
        this.updateUI();
     }
 
     public setBuildData(data: MapBuildData): void {
        this._data = data;
        this.updateUI();
     }

    public updateUI(): void {
     
        if (this._data) {
            if (this._data.type == MapResType.Fortress){
                this.spr.spriteFrame = this.buildAtlas.getSpriteFrame("component_119");
            }else{
                this.spr.spriteFrame = null;
            }
        }
    }

    protected startGiveUp(){
        this.unscheduleAllCallbacks();
        this.schedule(this.updateGiveUpTime, 1);
        this.updateGiveUpTime();
    }

    protected stopGiveUp(){
        this.unscheduleAllCallbacks();
        this.giveUpNode.active = false;
    }

    protected updateGiveUpTime(){
        var diff = DateUtil.leftTime(this._data.giveUpTime)
        if (diff <= 0){
            this.stopGiveUp();
        }else{
            this.giveUpNode.active = true;
            this.giveUpLabTime.string = DateUtil.leftTimeStr(this._data.giveUpTime);
        }
    }
}