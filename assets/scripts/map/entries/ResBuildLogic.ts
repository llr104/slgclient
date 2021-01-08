import DateUtil from "../../utils/DateUtil";
import { MapBuildData } from "../MapBuildProxy";
import MapCommand from "../MapCommand";
import { MapResType } from "../MapProxy";

const { ccclass, property } = cc._decorator;

@ccclass
export default class ResBuildLogic extends cc.Component {
    @property(cc.Sprite)
    spr: cc.Sprite = null;

    protected _data: MapBuildData = null;

    protected onLoad(): void {
        
    }

    protected onDestroy(): void {
        
    }

    protected onEnable():void {
        cc.systemEvent.on("unionChange", this.onUnionChange, this);
    }

    protected onDisable():void {
        this._data = null;
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
            if (this._data.rid == MapCommand.getInstance().buildProxy.myId) {
                this.spr.node.color = cc.Color.GREEN;
            } else if (this._data.unionId > 0 && this._data.unionId == MapCommand.getInstance().buildProxy.myUnionId) {
                this.spr.node.color = cc.Color.BLUE
            }else if (this._data.unionId > 0 && this._data.unionId == MapCommand.getInstance().buildProxy.myParentId) {
                this.spr.node.color = cc.Color.MAGENTA;
            } else if (this._data.parentId > 0 && this._data.parentId == MapCommand.getInstance().buildProxy.myUnionId) {
                this.spr.node.color = cc.Color.YELLOW;
            }else {
                this.spr.node.color = cc.Color.RED;
            }
        }
    }

}