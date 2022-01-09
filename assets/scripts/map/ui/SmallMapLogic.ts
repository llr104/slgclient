import { _decorator, Component, EditBox, Node, Vec2 } from 'cc';
const { ccclass, property } = _decorator;

import MapCommand from "../MapCommand";
import MapUtil from "../MapUtil";
import { EventMgr } from '../../utils/EventMgr';

@ccclass('SmallMapLogic')
export default class SmallMapLogic extends Component {
    @property(EditBox)
    editBoxX: EditBox = null;
    @property(EditBox)
    editBoxY: EditBox = null;

    protected _armys: Node[] = [];
    protected _citys: Node[] = [];

    protected onLoad(): void {
        EventMgr.on("map_center_change", this.onMapCenterChange, this);
        EventMgr.on("scroll_to_map", this.onScrollToMap, this);
        this.updateView();
    }

    protected onDestroy(): void {
        EventMgr.targetOff(this);
    }

    protected updateView() {
        let centerPoint:Vec2 = MapCommand.getInstance().proxy.getCurCenterPoint();
        if (centerPoint) {
            this.editBoxX.string = centerPoint.x.toString();
            this.editBoxY.string = centerPoint.y.toString();
        }
    }

    protected onMapCenterChange(): void {
        this.updateView();
    }

    protected onScrollToMap():void {
        this.updateView();
    }

    onClickJump(): void {
        let x: number = Number(this.editBoxX.string);
        let y: number = Number(this.editBoxY.string);
        if (x >= 0 
            && y >= 0 
            && x < MapUtil.mapSize.width 
            && y < MapUtil.mapSize.height) {
                EventMgr.emit("scroll_to_map", x, y);
        } else {
            console.log("跳转无效位置", x, y);
        }
    }
}
