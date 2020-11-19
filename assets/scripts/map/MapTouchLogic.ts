import MapCommand from "./MapCommand";
import MapUtil from "./MapUtil";

const { ccclass, property } = cc._decorator;

@ccclass
export default class MapResLogic extends cc.Component {
    protected _cmd: MapCommand;

    protected onLoad(): void {
        this._cmd = MapCommand.getInstance();
        cc.systemEvent.on("touch_map", this.onTouchMap, this);
    }

    protected onDestroy(): void {
        cc.systemEvent.targetOff(this);
        this._cmd = null;
    }

    protected onTouchMap(mapPoint: cc.Vec2, clickCenterPoint: cc.Vec2): void {
        console.log("点击区域 (" + mapPoint.x + "," + mapPoint.y + ")");
        if (MapUtil.isVaildCellPoint(mapPoint) == false) {
            console.log("点击到无效区域");
            return;
        }

        let cellId:number = MapUtil.getIdByCellPoint(mapPoint.x, mapPoint.y);
        if (this._cmd.proxy.getCity(cellId) != null) {
            //代表点击的是城市
			cc.systemEvent.emit("open_city_about", this._cmd.proxy.getCity(cellId));
            return;
        }

        if (this._cmd.proxy.getBuild(cellId) != null) {
            //代表点击被占领的区域
            console.log("点击被占领的区域", this._cmd.proxy.getBuild(cellId));
            return;
        }

        console.log("点击野外区域", this._cmd.proxy.getResData(cellId));
    }

    public updateNodeByArea(areaIndex: number): void {

    }

    public updateEntry(node: cc.Node, data: any): void {

    }
}