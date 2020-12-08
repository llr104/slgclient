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