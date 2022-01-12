import { _decorator, Component, TiledMap, Camera, Node, Vec2, Event, game, UITransform, EventMouse, EventTouch, Vec3, view } from 'cc';
const { ccclass, property } = _decorator;

import MapCommand from "./MapCommand";
import MapUtil from "./MapUtil";
import { EventMgr } from '../utils/EventMgr';

@ccclass('MapLogic')
export default class MapLogic extends Component {
    protected _cmd: MapCommand;
    protected _tiledMap: TiledMap = null;
    protected _mapCamera: Camera = null;
    protected _isTouch: boolean = false;
    protected _isMove: boolean = false;
    //地图相机缩放倍率边界
    protected _minZoomRatio: number = 1;
    protected _maxZoomRatio: number = 0.8;
    protected _changeZoomRadix: number = 200;
    protected _orthoHeight:number = 360;

    //地图相机移动边界
    protected _maxMapX: number = 1;
    protected _maxMapY: number = 1;

    protected _touchAniNode: Node = null;
    protected _centerPoint: Vec2 = null;

    protected onLoad(): void {
        console.log("MapLogic onLoad");
        this._cmd = MapCommand.getInstance();
        this._mapCamera = this.node.parent.getChildByName("Map Camera").getComponent(Camera);
        console.log("_mapCamera:", this._mapCamera);
        this._orthoHeight = this._mapCamera.orthoHeight;

        EventMgr.on("open_city_about", this.openCityAbout, this);
        EventMgr.on("close_city_about", this.closeCityAbout, this);

    }

    protected onDestroy(): void {
        EventMgr.targetOff(this);

        this._cmd = null;
    }

    public setTiledMap(tiledMap: TiledMap): void {
        this._tiledMap = tiledMap;
        this._tiledMap.enableCulling = true;

        this.updateCulling();
        
        var uit = this._tiledMap.node.getComponent(UITransform);
        this._maxMapX = (uit.width - view.getVisibleSize().width) * 0.5;
        this._maxMapY = (uit.height - view.getVisibleSize().height) * 0.5;
        this._tiledMap.node.on(Node.EventType.MOUSE_WHEEL, this.onMouseWheel, this);
        this._tiledMap.node.on(Node.EventType.TOUCH_START, this.onTouchBegan, this);
        this._tiledMap.node.on(Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this._tiledMap.node.on(Node.EventType.TOUCH_END, this.onTouchEnd, this);
        this._tiledMap.node.on(Node.EventType.TOUCH_CANCEL, this.onTouchCancel, this);
    }

    protected openCityAbout(data: any): void {
        this._mapCamera.orthoHeight = this._orthoHeight * this._maxZoomRatio;
    }

    protected closeCityAbout(): void {
        this._mapCamera.orthoHeight = this._orthoHeight * this._minZoomRatio;
    }

    protected onMouseWheel(event: EventMouse): void {
        console.log("onMouseWheel");

        let scrollY: number = event.getScrollY();
        let changeRatio: number = Number((scrollY / this._changeZoomRadix).toFixed(1));
        let newZoomRatio: number = Math.min(this._minZoomRatio, Math.max(this._maxZoomRatio, this._mapCamera.orthoHeight/this._orthoHeight + changeRatio));

        console.log("onMouseWheel:", newZoomRatio);
        this._mapCamera.orthoHeight = this._orthoHeight * newZoomRatio;
    }

    protected onTouchMove(event: EventTouch): void {
        if (this._isTouch) {
            let delta: Vec2 = event.getDelta();
            if (delta.x != 0 || delta.y != 0) {
                this._isMove = true;
                let pixelPoint: Vec2 = new Vec2(0, 0);
                pixelPoint.x = this._mapCamera.node.position.x - delta.x;
                pixelPoint.y = this._mapCamera.node.position.y - delta.y;
                pixelPoint.x = Math.min(this._maxMapX, Math.max(-this._maxMapX, pixelPoint.x));
                pixelPoint.y = Math.min(this._maxMapY, Math.max(-this._maxMapY, pixelPoint.y));
                this._mapCamera.node.setPosition(new Vec3(pixelPoint.x, pixelPoint.y, this._mapCamera.node.position.z));
                this.setCenterMapCellPoint(MapUtil.mapPixelToCellPoint(pixelPoint), pixelPoint);
                this.updateCulling();
            }
        }
    }

    protected onTouchBegan(event: EventTouch): void {
        this._isTouch = true;
        this._isMove = false;
    }

    protected onTouchEnd(event: EventTouch): void {
        this._isTouch = false;
        if (this._isMove == false) {
            let touchLocation: Vec2 = event.touch.getUILocation();
            let touchLocation1 = this.viewPointToWorldPoint(touchLocation);
            let mapPoint: Vec2 = MapUtil.worldPixelToMapCellPoint(touchLocation1);
            let clickCenterPoint: Vec2 = MapUtil.mapCellToPixelPoint(mapPoint);
            //派发事件
            // console.log("onTouchEnd:", touchLocation1, clickCenterPoint);

            EventMgr.emit("touch_map", mapPoint, clickCenterPoint);
        } else {
            EventMgr.emit("move_map");
        }
        this._isMove = false;
    }

    protected onTouchCancel(event: EventTouch): void {
        this._isTouch = false;
        this._isMove = false;
    }

    //界面坐标转世界坐标
    protected viewPointToWorldPoint(point: Vec2): Vec2 {
        // console.log("viewPointToWorldPoint in", point.x, point.y);

        let canvasNode: Node = this.node.parent;
        let cuit = canvasNode.getComponent(UITransform);
        let uit = this._tiledMap.node.getComponent(UITransform);


        let cameraWorldX: number = uit.width * uit.anchorX - view.getVisibleSize().width * cuit.anchorX + this._mapCamera.node.position.x;
        let cameraWorldY: number = uit.height * uit.anchorY - view.getVisibleSize().height * cuit.anchorY + this._mapCamera.node.position.y;

        return new Vec2(point.x + cameraWorldX, point.y + cameraWorldY);
    }



    //世界坐标转化为相对地图的像素坐标
    protected worldToMapPixelPoint(point: Vec2): Vec2 {
        var uit = this._tiledMap.node.getComponent(UITransform);
        let pixelX: number = point.x - uit.width * uit.anchorX;
        let pixelY: number = point.y - uit.height * uit.anchorY;
        return new Vec2(pixelX, pixelY);
    }

    public scrollToMapPoint(point: Vec2): void {
        let pixelPoint: Vec2 = MapUtil.mapCellToPixelPoint(point);
        // console.log("scrollToMapPoint", pixelPoint.x, pixelPoint.y);
        let positionX: number = Math.min(this._maxMapX, Math.max(-this._maxMapX, pixelPoint.x));
        let positionY: number = Math.min(this._maxMapY, Math.max(-this._maxMapY, pixelPoint.y));
        let pos = this._mapCamera.node.position.clone();
        pos.x = positionX;
        pos.y = positionY;
        this._mapCamera.node.position = pos;
    
        this.setCenterMapCellPoint(point, pixelPoint);

        this.updateCulling();
    }

    protected setCenterMapCellPoint(point: Vec2, pixelPoint: Vec2): void {
        this._cmd.proxy.setCurCenterPoint(point, pixelPoint);
    }

    private updateCulling() {
        if(this._tiledMap){
            // let layers = this._tiledMap.getLayers();
            // for (let index = 0; index < layers.length; index++) {
            //     const l = layers[index];
            //     l.updateCulling();
            // }

            // this.scheduleOnce(()=>{
            //     for (let index = 0; index < layers.length; index++) {
            //         const l = layers[index];
            //         l.updateCulling();
            //     }
            // })

            this._tiledMap.node.emit(Node.EventType.TRANSFORM_CHANGED);
            this.scheduleOnce(()=>{
                this._tiledMap.node.emit(Node.EventType.TRANSFORM_CHANGED);
            })
    
        }

     }
}
