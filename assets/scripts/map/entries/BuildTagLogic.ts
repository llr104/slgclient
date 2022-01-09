import { _decorator, Component, Node } from 'cc';
import MapCommand from "../MapCommand";
import { MapResData } from "../MapProxy";
import { EventMgr } from '../../utils/EventMgr';
const { ccclass, property } = _decorator;


@ccclass('BuildTagLogic')
export default class BuildTagLogic extends Component {
   
    protected _data: MapResData = null;

    @property(Node)
    tagIconNode: Node = null;

    protected onLoad(): void {
        this.tagIconNode.active = false;
    }

    protected onEnable(): void {
        EventMgr.on("update_tag", this.onUpdateTag, this);

    }

    protected onDisable(): void {
        this._data = null;
        EventMgr.targetOff(this);
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
