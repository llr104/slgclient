import DateUtil from "../../utils/DateUtil";
import { MapBuildData } from "../MapBuildProxy";
import MapCommand from "../MapCommand";
import { MapResData } from "../MapProxy";
// import MapCommand from "../MapCommand";

const { ccclass, property } = cc._decorator;

@ccclass
export default class BuildTagLogic extends cc.Component {
   
    protected _data: MapResData = null;

    @property(cc.Node)
    tagIconNode: cc.Node = null;

    protected onLoad(): void {
        this.tagIconNode.active = false;
    }

    protected onEnable(): void {
        cc.systemEvent.on("update_tag", this.onUpdateTag, this);

    }

    protected onDisable(): void {
        this._data = null;
        cc.systemEvent.targetOff(this);
    }

     public setResourceData(data: MapResData): void {
        this._data = data;
        this.updateUI();
     }

    public updateUI(): void {
        if (this._data) {
            this.tagIconNode.active = MapCommand.getInstance().proxy.isPosTag(this._data.x, this._data.y);
        }
    }

    protected onUpdateTag() {
        this.updateUI();
    }
}