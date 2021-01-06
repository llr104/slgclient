import DateUtil from "../../utils/DateUtil";
import { MapBuildData } from "../MapBuildProxy";
import MapCommand from "../MapCommand";
import { MapResConfig, MapResData, MapResType } from "../MapProxy";

const { ccclass, property } = cc._decorator;

@ccclass
export default class BuildLogic extends cc.Component {
    @property(cc.Sprite)
    spr: cc.Sprite = null;

    @property(cc.Label)
    nameLab: cc.Label = null;

    @property(cc.SpriteAtlas)
    buildAtlas: cc.SpriteAtlas = null;

    protected _data: MapBuildData = null;

    protected onLoad(): void {
        
    }

    protected onDestroy(): void {
        this._data = null;
    }

    protected onEnable():void {
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

                let resData: MapResData = MapCommand.getInstance().proxy.getResData(this._data.id);
                let resCfg: MapResConfig = MapCommand.getInstance().proxy.getResConfig(resData.type, resData.level);
                
                if (this._data.nickName != null){
                    this.nameLab.string = this._data.nickName + ":" + this._data.name;
                }else{
                    this.nameLab.string = resCfg.name;
                }

            }else{
                this.spr.spriteFrame = null;
            }
        }
    }
}