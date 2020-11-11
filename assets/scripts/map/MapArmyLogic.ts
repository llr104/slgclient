import MapUtil from "../utils/MapUtil";
import ArmyLogic from "./ArmyLogic";

const { ccclass, property } = cc._decorator;

@ccclass
export default class MapArmyLogic extends cc.Component {

    @property(cc.Prefab)
    armyPrefab: cc.Prefab = null;
    protected _parentLayer: cc.TiledLayer = null;
    protected _army:cc.Node = null;

    protected onLoad(): void {
        this._parentLayer = MapUtil.tiledMap.getLayer("army");
        let position: cc.Vec2 = MapUtil.mapToWorldPixelPoint(cc.v2(0, 0));
        position.x -= this.node.width * this.node.anchorX;
        position.y -= this.node.height * this.node.anchorY;
        this._army = cc.instantiate(this.armyPrefab);
        this._army.setPosition(position);
        this._army.getComponent(ArmyLogic).mapPointX = 0;
        this._army.getComponent(ArmyLogic).mapPointY = 0;
        this._parentLayer.addUserNode(this._army);
        console.log("this._army", this._army);
        cc.systemEvent.on("touch_map", this.onTouchMap, this);
    }

    protected onDestroy(): void {
        cc.systemEvent.targetOff(this);
    }

    protected onTouchMap(mapPoint: cc.Vec2, worldPixelPoint: cc.Vec2):void {
        let guid: number = MapUtil.tiledMap.getLayer("ground").getTileGIDAt(mapPoint);
        console.log("onTouchMap guid ", guid);
        if (guid > 0) {
            //不可行走区域
            console.log("不可行走区域 山或者水(" + mapPoint.x + " , " + mapPoint.y + ")");
        } else {
            console.log("可行走区域(" + mapPoint.x + " , " + mapPoint.y + ")");
        }
    }
}