import MapCommand from "../MapCommand";
import MapUtil from "../MapUtil";

const { ccclass, property } = cc._decorator;

@ccclass
export default class SmallMapLogic extends cc.Component {
    @property(cc.EditBox)
    editBoxX: cc.EditBox = null;
    @property(cc.EditBox)
    editBoxY: cc.EditBox = null;

    protected _armys: cc.Node[] = [];
    protected _citys: cc.Node[] = [];

    protected onLoad(): void {
        cc.systemEvent.on("map_center_change", this.onMapCenterChange, this);
        cc.systemEvent.on("scroll_top_map", this.onScrollToMap, this);
        this.updateView();
    }

    protected onDestroy(): void {
        cc.systemEvent.targetOff(this);
    }

    protected updateView() {
        let centerPoint:cc.Vec2 = MapCommand.getInstance().proxy.getCurCenterPoint();
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
        let y: number = Number(this.editBoxX.string);
        if (x >= 0 
            && y >= 0 
            && x < MapUtil.mapSize.width 
            && y < MapUtil.mapSize.height) {
                cc.systemEvent.emit("scroll_top_map", x, y);
        } else {
            console.log("跳转无效位置", x, y);
        }
    }
}