import { MapBuildData } from "../MapBuildProxy";
import MapCommand from "../MapCommand";

const { ccclass, property } = cc._decorator;

@ccclass
export default class BuildLogic extends cc.Component {
    @property(cc.Sprite)
    spr: cc.Sprite = null;
    @property(cc.SpriteAtlas)
    buildAtlas: cc.SpriteAtlas = null;

    protected _data: MapBuildData = null;

    protected onLoad(): void {
        
    }

    protected onDestroy(): void {
        this._data = null;
    }

    protected onEnable():void {
        cc.systemEvent.on("my_union_change", this.onUnionChange, this);
    }

    protected onDisable():void {
        cc.systemEvent.targetOff(this);
    }

    protected onUnionChange(rid:number, cityId:number, isMine:boolean):void {
        if (isMine || rid == this._data.rid) {
            this.setBuildData(this._data);
        }
    }

    public setBuildData(data: MapBuildData): void {
        this._data = data;
        if (this._data) {
            if (this._data.rid == MapCommand.getInstance().buildProxy.myId) {
                this.spr.node.color = cc.Color.GREEN;
            } else if (this._data.unionId == MapCommand.getInstance().buildProxy.myUnionId) {
                this.spr.node.color = cc.Color.BLUE;
            } else {
                this.spr.node.color = cc.Color.RED;
            }
        }
    }
}