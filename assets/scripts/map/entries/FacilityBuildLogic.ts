import DateUtil from "../../utils/DateUtil";
import { MapBuildData } from "../MapBuildProxy";
import MapCommand from "../MapCommand";
import { MapAreaData, MapResConfig, MapResData, MapResType } from "../MapProxy";

const { ccclass, property } = cc._decorator;

@ccclass
export default class FacilityBuildLogic extends cc.Component {
    @property(cc.Sprite)
    spr: cc.Sprite = null;

    @property(cc.Label)
    nameLab: cc.Label = null;

    @property(cc.Label)
    tipsLab: cc.Label = null;

    @property(cc.SpriteAtlas)
    buildAtlas: cc.SpriteAtlas = null;

    protected _data: MapBuildData = null;

    protected onLoad(): void {
        
    }

    protected onEnable():void {
       
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
            if (this._data.type == MapResType.Fortress){
                this.spr.spriteFrame = this.buildAtlas.getSpriteFrame("component_119");

                let resData: MapResData = MapCommand.getInstance().proxy.getResData(this._data.id);
                let resCfg: MapResConfig = MapCommand.getInstance().proxy.getResConfig(resData.type, resData.level);
                
                if (this._data.nickName != null){
                    this.nameLab.string = this._data.nickName + ":" + this._data.name;
                }else{
                    this.nameLab.string = resCfg.name;
                }

                if (this._data.isBuilding() || this._data.isUping()){
                    this.startCountDownTime();
                }
                else{
                    this.tipsLab.string = "";
                }
            }else{
                this.spr.spriteFrame = null;
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
        } else{
            this.tipsLab.string = "";
            this.stopCountDownTime();
            console.log("qryNationMapScanBlock");
            //请求刷新
            let qryData: MapAreaData = new MapAreaData();
            qryData.startCellX = this._data.x;
            qryData.startCellY = this._data.y;
            qryData.len = 1;
            MapCommand.getInstance().qryNationMapScanBlock(qryData);
        }
    }

    public stopCountDownTime() {
        this.unschedule(this.countDownTime);
    }
}