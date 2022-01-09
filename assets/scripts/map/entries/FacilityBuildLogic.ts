import { _decorator, Component, Sprite, Label, SpriteAtlas, Vec2 } from 'cc';
const { ccclass, property } = _decorator;

import DateUtil from "../../utils/DateUtil";
import { MapBuildData } from "../MapBuildProxy";
import MapCommand from "../MapCommand";
import { MapAreaData, MapResConfig, MapResData, MapResType } from "../MapProxy";
import MapUtil from "../MapUtil";

@ccclass('FacilityBuildLogic')
export default class FacilityBuildLogic extends Component {
    @property(Sprite)
    spr: Sprite | null = null;
    @property(Label)
    nameLab: Label | null = null;
    @property(Label)
    tipsLab: Label | null = null;
    @property(SpriteAtlas)
    buildAtlas: SpriteAtlas | null = null;
    protected _data: MapBuildData = null;
    protected _cmd: MapCommand = null;
    protected onLoad(): void {
        this._cmd =  MapCommand.getInstance();
    }
    protected onEnable():void {
        this.nameLab.string = "";
        this.tipsLab.string = "";
        this.spr.spriteFrame = null;

    }
    protected onDisable(): void {
        this._data = null;
        this.unscheduleAllCallbacks();
    }
     public setBuildData(data: MapBuildData): void {
        this._data = data;
        this.updateUI();
     }
    public updateUI(): void {

        if (this._data) {
        if (this._data.type == MapResType.FORTRESS){
        this.spr.spriteFrame = this.buildAtlas.getSpriteFrame("component_119");

        let resData: MapResData = MapCommand.getInstance().proxy.getResData(this._data.id);
        let resCfg: MapResConfig = MapCommand.getInstance().proxy.getResConfig(resData.type, resData.level);

        if (this._data.nickName != null){
        this.nameLab.string = this._data.nickName + ":" + this._data.name;
        }else{
        this.nameLab.string = resCfg.name;
        }

        if (this._data.isBuilding() || this._data.isUping() || this._data.isDestroying()){
        this.startCountDownTime();
        }
        else{
        this.tipsLab.string = "";
        }
        }else{
        this.spr.spriteFrame = null;
        this.nameLab.string = "";
        }
        }
    }
    public startCountDownTime(){
        console.log("startCountDownTime");
        this.stopCountDownTime();
        this.schedule(this.countDownTime, 1.0);
        this.countDownTime();
    }
    public countDownTime() {
        if (this._data.isBuilding()){
        this.tipsLab.string = "建设中..." + DateUtil.leftTimeStr(this._data.endTime);
        } else if(this._data.isUping()){
        this.tipsLab.string = "升级中..." + DateUtil.leftTimeStr(this._data.endTime);
        } else if(this._data.isDestroying()){
        this.tipsLab.string = "拆除中..." + DateUtil.leftTimeStr(this._data.endTime);
        } else{
        this.tipsLab.string = "";
        this.stopCountDownTime();
        console.log("qryNationMapScanBlock");

        let areaPoint: Vec2 = MapUtil.getAreaPointByCellPoint(this._data.x, this._data.y);
        let areaId: number = MapUtil.getIdByAreaPoint(areaPoint.x, areaPoint.y);
        let areaData: MapAreaData = this._cmd.proxy.getMapAreaData(areaId);
        this._cmd.qryNationMapScanBlock(areaData);
        }

    }
    public stopCountDownTime() {
        this.unschedule(this.countDownTime);
    }
}

