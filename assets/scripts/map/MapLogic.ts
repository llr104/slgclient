import MapCommand from "./MapCommand";

const { ccclass, property } = cc._decorator;

@ccclass
export default class MapLogic extends cc.Component {
    protected _cmd: MapCommand;
    protected _tiledMap: cc.TiledMap = null;
    protected _mapCamera: cc.Camera = null;
    protected _isTouch: boolean = false;
    protected _isMove: boolean = false;
    //地图相机缩放倍率边界
    protected _minZoomRatio: number = 1;
    protected _maxZoomRatio: number = 1.5;
    protected _changeZoomRadix: number = 200;
    //地图相机移动边界
    protected _maxMapX: number = 1;
    protected _maxMapY: number = 1;

    protected _touchAniNode: cc.Node = null;
    protected _centerPoint: cc.Vec2 = null;

    protected onLoad(): void {
        console.log("MapLogic onLoad");
        this._cmd = MapCommand.getInstance();
        this._mapCamera = cc.Canvas.instance.node.getChildByName("Map Camera").getComponent(cc.Camera);

    }

    protected onDestroy(): void {
        this._cmd = null;
    }

    public setTiledMap(tiledMap: cc.TiledMap): void {
        this._tiledMap = tiledMap;
        this._tiledMap.enableCulling(true);
        this._maxMapX = (this._tiledMap.node.width - cc.game.canvas.width) * 0.5;
        this._maxMapY = (this._tiledMap.node.height - cc.game.canvas.height) * 0.5;
        this._tiledMap.node.on(cc.Node.EventType.MOUSE_WHEEL, this.onMouseWheel, this);
        this._tiledMap.node.on(cc.Node.EventType.TOUCH_START, this.onTouchBegan, this);
        this._tiledMap.node.on(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this._tiledMap.node.on(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this);
        this._tiledMap.node.on(cc.Node.EventType.TOUCH_CANCEL, this.onTouchCancel, this);
    }

    protected onMouseWheel(event: cc.Event.EventMouse): void {
        let scrollY: number = event.getScrollY();
        let changeRatio: number = Number((scrollY / this._changeZoomRadix).toFixed(1));
        let newZoomRatio: number = Math.min(this._maxZoomRatio, Math.max(this._minZoomRatio, this._mapCamera.zoomRatio + changeRatio));
        this._mapCamera.zoomRatio = newZoomRatio;
    }

    protected onTouchMove(event: cc.Event.EventTouch): void {
        if (this._isTouch) {
            let delta: cc.Vec2 = event.getDelta();
            if (delta.x != 0 || delta.y != 0) {
                this._isMove = true;
                let pixelPoint: cc.Vec2 = cc.v2(0, 0);
                pixelPoint.x = this._mapCamera.node.x - delta.x;
                pixelPoint.y = this._mapCamera.node.y - delta.y;
                pixelPoint.x = Math.min(this._maxMapX, Math.max(-this._maxMapX, pixelPoint.x));
                pixelPoint.y = Math.min(this._maxMapY, Math.max(-this._maxMapY, pixelPoint.y));
                this._mapCamera.node.setPosition(pixelPoint);
                this.setCenterMapCellPoint(this._cmd.proxy.mapPixelToCellPoint(pixelPoint), pixelPoint);
            }
        }
    }

    protected onTouchBegan(event: cc.Event.EventTouch): void {
        this._isTouch = true;
        this._isMove = false;
    }

    protected onTouchEnd(event: cc.Event.EventTouch): void {
        this._isTouch = false;
        if (this._isMove == false) {
            let touchLocation: cc.Vec2 = event.touch.getLocation();
            touchLocation = this.viewPointToWorldPoint(touchLocation);
            let mapPoint: cc.Vec2 = this._cmd.proxy.worldPixelToMapCellPoint(touchLocation);
            let clickCenterPoint: cc.Vec2 = this._cmd.proxy.mapCellToWorldPixelPoint(mapPoint);
            clickCenterPoint = this.worldToMapPixelPoint(clickCenterPoint);
            //派发事件
            cc.systemEvent.emit("touch_map", mapPoint, clickCenterPoint);
        }
        this._isMove = false;
    }

    protected onTouchCancel(event: cc.Event.EventTouch): void {
        this._isTouch = false;
        this._isMove = false;
    }

    //界面坐标转世界坐标
    protected viewPointToWorldPoint(point: cc.Vec2): cc.Vec2 {
        let canvasNode: cc.Node = cc.Canvas.instance.node;
        let cameraWorldX: number = this._tiledMap.node.width * this._tiledMap.node.anchorX - canvasNode.width * canvasNode.anchorX + this._mapCamera.node.x;
        let cameraWorldY: number = this._tiledMap.node.height * this._tiledMap.node.anchorY - canvasNode.height * canvasNode.anchorY + this._mapCamera.node.y;
        return cc.v2(point.x + cameraWorldX, point.y + cameraWorldY);
    }

    //世界坐标转化为相对地图的像素坐标
    protected worldToMapPixelPoint(point: cc.Vec2): cc.Vec2 {
        let pixelX: number = point.x - this._tiledMap.node.width * this._tiledMap.node.anchorX;
        let pixelY: number = point.y - this._tiledMap.node.height * this._tiledMap.node.anchorY;
        return cc.v2(pixelX, pixelY);
    }

    public scrollToMapPoint(point: cc.Vec2): void {
        let pixelPoint: cc.Vec2 = this._cmd.proxy.mapCellToPixelPoint(point);
        // console.log("scrollToMapPoint", pixelPoint.x, pixelPoint.y);
        let positionX: number = Math.min(this._maxMapX, Math.max(-this._maxMapX, pixelPoint.x));
        let positionY: number = Math.min(this._maxMapY, Math.max(-this._maxMapY, pixelPoint.y));
        this._mapCamera.node.x = positionX;
        this._mapCamera.node.y = positionY;
        // console.log("scrollToMapPoint", point.x, point.y, this._mapCamera.node.x, this._mapCamera.node.y);
        this.setCenterMapCellPoint(point, pixelPoint);
    }

    protected setCenterMapCellPoint(point: cc.Vec2, pixelPoint: cc.Vec2): void {
        // console.log("setCenterMapCellPoint", point);
        this._cmd.proxy.setCurCenterPoint(point, pixelPoint);
    }
}
