import MapCommand from "./MapCommand";

const { ccclass, property } = cc._decorator;

@ccclass
export default class MapLogic extends cc.Component {

    // @property(cc.Camera)
    // mapCamera: cc.Camera = null;
    @property(cc.TiledMap)
    tiledMap: cc.TiledMap = null;
    // @property(cc.Node)
    // touchAniNode: cc.Node = null;

    protected _cmd: MapCommand;

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
        this.tiledMap.enableCulling(true);
        // this.touchAniNode.active = false;
        this._cmd.proxy.initMapConfig(this.tiledMap);

        this._maxMapX = (this.tiledMap.node.width - cc.game.canvas.width) * 0.5;
        this._maxMapY = (this.tiledMap.node.height - cc.game.canvas.height) * 0.5;
        this.tiledMap.node.on(cc.Node.EventType.MOUSE_WHEEL, this.onMouseWheel, this);
        this.tiledMap.node.on(cc.Node.EventType.TOUCH_START, this.onTouchBegan, this);
        this.tiledMap.node.on(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.tiledMap.node.on(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this);
        this.tiledMap.node.on(cc.Node.EventType.TOUCH_CANCEL, this.onTouchCancel, this);
    }

    protected onDestroy(): void {
        this._cmd = null;
    }

    protected onMouseWheel(event: cc.Event.EventMouse): void {
        let scrollY: number = event.getScrollY();
        let changeRatio: number = Number((scrollY / this._changeZoomRadix).toFixed(1));
        let newZoomRatio: number = Math.min(this._maxZoomRatio, Math.max(this._minZoomRatio, this._mapCamera.zoomRatio + changeRatio));
        this._mapCamera.zoomRatio = newZoomRatio;
    }

    protected onTouchMove(event: cc.Event.EventTouch): void {
        if (this._isTouch) {
            this._isMove = true;
            let delta: cc.Vec2 = event.getDelta();
            let positionX: number = this._mapCamera.node.x - delta.x;
            let positionY: number = this._mapCamera.node.y - delta.y;
            positionX = Math.min(this._maxMapX, Math.max(-this._maxMapX, positionX));
            positionY = Math.min(this._maxMapY, Math.max(-this._maxMapY, positionY));
            this._mapCamera.node.x = positionX;
            this._mapCamera.node.y = positionY;
            this.setCenterMapCellPoint(this._cmd.proxy.mapPixelToCellPoint(cc.v2(positionX, positionY)));
        }
    }

    protected onTouchBegan(event: cc.Event.EventTouch): void {
        this._isTouch = true;
        this._isMove = false;
    }

    protected onTouchEnd(event: cc.Event.EventTouch): void {
        this._isTouch = false;
        console.log("onTouchEnd", this._isMove);
        if (this._isMove == false) {
            let touchLocation: cc.Vec2 = event.touch.getLocation();
            // console.log("onTouchEnd", touchLocation.x, touchLocation.y);
            touchLocation = this.viewPointToWorldPoint(touchLocation);
            let mapPoint: cc.Vec2 = this._cmd.proxy.worldPixelToMapCellPoint(touchLocation);
            let clickCenterPoint: cc.Vec2 = this._cmd.proxy.mapCellToWorldPixelPoint(mapPoint);
            clickCenterPoint = this.worldToMapPixelPoint(clickCenterPoint);
            // console.log("onTouchEnd", touchLocation.x, touchLocation.y)
            // console.log("onTouchEnd", mapPoint.x, mapPoint.y)
            // console.log("onTouchEnd", clickCenterPoint.x, clickCenterPoint.y)
            if (mapPoint.x < 0 || mapPoint.x >= this.tiledMap.getMapSize().width
                || mapPoint.y < 0 || mapPoint.y >= this.tiledMap.getMapSize().height) {
                console.log("点击到了地图区域外 (" + mapPoint.x + "," + mapPoint.y + ")");
                return;
            }

            //点击特效
            // if (this._touchAniNode == null) {
            //     this._touchAniNode = cc.instantiate(this.touchAniNode);
            //     this._touchAniNode.active = true;
            // }
            // if (this._touchAniNode.parent == null) {
            //     this.tiledMap.getLayer("mountain").addUserNode(this._touchAniNode);
            // }
            // this._touchAniNode.x = clickCenterPoint.x;
            // this._touchAniNode.y = clickCenterPoint.y;
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
        let cameraWorldX: number = this.tiledMap.node.width * this.tiledMap.node.anchorX - canvasNode.width * canvasNode.anchorX + this._mapCamera.node.x;
        let cameraWorldY: number = this.tiledMap.node.height * this.tiledMap.node.anchorY - canvasNode.height * canvasNode.anchorY + this._mapCamera.node.y;
        return cc.v2(point.x + cameraWorldX, point.y + cameraWorldY);
    }

    //世界坐标转化为相对地图的像素坐标
    protected worldToMapPixelPoint(point: cc.Vec2): cc.Vec2 {
        let pixelX: number = point.x - this.tiledMap.node.width * this.tiledMap.node.anchorX;
        let pixelY: number = point.y - this.tiledMap.node.height * this.tiledMap.node.anchorY;
        return cc.v2(pixelX, pixelY);
    }

    public scrollToMapPoint(point: cc.Vec2): void {
        let centerPoint: cc.Vec2 = this._cmd.proxy.mapCellToPixelPoint(point);
        console.log("scrollToMapPoint", centerPoint.x, centerPoint.y);
        let positionX: number = Math.min(this._maxMapX, Math.max(-this._maxMapX, centerPoint.x));
        let positionY: number = Math.min(this._maxMapY, Math.max(-this._maxMapY, centerPoint.y));
        this._mapCamera.node.x = positionX;
        this._mapCamera.node.y = positionY;
        console.log("scrollToMapPoint", point.x, point.y, this._mapCamera.node.x, this._mapCamera.node.y);
        this.setCenterMapCellPoint(point);
    }

    protected setCenterMapCellPoint(point: cc.Vec2): void {
        console.log("setCenterMapCellPoint", point);
        this._cmd.proxy.setCurCenterPoint(point);
    }
}
