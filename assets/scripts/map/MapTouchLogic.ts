import MapClickUILogic from "./MapClickUILogic";
import MapCommand from "./MapCommand";
import MapUtil from "./MapUtil";

const { ccclass, property } = cc._decorator;

@ccclass
export default class MapTouchLogic extends cc.Component {
    @property(cc.Prefab)
    clickUIPrefab: cc.Prefab = null;

    protected _cmd: MapCommand;
    protected _clickUINode: cc.Node = null;

    protected onLoad(): void {
        this._cmd = MapCommand.getInstance();
        cc.systemEvent.on("touch_map", this.onTouchMap, this);
        cc.systemEvent.on("move_map", this.onMoveMap, this);
    }

    protected onDestroy(): void {
        cc.systemEvent.targetOff(this);
        this._cmd = null;
        this._clickUINode = null;
    }

    protected onTouchMap(mapPoint: cc.Vec2, clickPixelPoint: cc.Vec2): void {
        console.log("点击区域 (" + mapPoint.x + "," + mapPoint.y + ")");
        this.removeClickUINode();
        if (MapUtil.isVaildCellPoint(mapPoint) == false) {
            console.log("点击到无效区域");
            return;
        }

        let cellId:number = MapUtil.getIdByCellPoint(mapPoint.x, mapPoint.y);
        let data:any = null;
        data = this._cmd.proxy.getCity(cellId);
        if (data != null) {
            //代表点击的是城市
            cc.systemEvent.emit("open_city_about", data);
            return;
        }

        data = this._cmd.proxy.getBuild(cellId);
        if (data != null) {
            //代表点击被占领的区域
            console.log("点击被占领的区域", data);
            this.showClickUINode(data, clickPixelPoint);
            return;
        }

        data = this._cmd.proxy.getResData(cellId);
        this.showClickUINode(data, clickPixelPoint);
        console.log("点击野外区域", data);
    }

    protected onMoveMap():void {
        this.removeClickUINode();
    }

    public showClickUINode(data:any, pos:cc.Vec2): void {
        if (this._clickUINode == null) {
            this._clickUINode = cc.instantiate(this.clickUIPrefab);
            
        }
        this._clickUINode.parent = this.node;
        this._clickUINode.setPosition(pos);
        this._clickUINode.getComponent(MapClickUILogic).setCellData(data, pos);
    }

    public removeClickUINode():void {
        if (this._clickUINode) {
            this._clickUINode.parent = null;
        }
    }
}