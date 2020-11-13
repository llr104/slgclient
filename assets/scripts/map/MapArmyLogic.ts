import ArmyLogic from "./ArmyLogic";
import MapCommand from "./MapCommand";
import MapProxy, { MapConfig } from "./MapProxy";

const { ccclass, property } = cc._decorator;

@ccclass
export default class MapArmyLogic extends cc.Component {
    @property(cc.TiledMap)
    tiledMap: cc.TiledMap = null;
    @property(cc.Prefab)
    armyPrefab: cc.Prefab = null;
    protected _proxy: MapProxy = null;
    protected _parentLayer: cc.TiledLayer = null;
    protected _army:cc.Node = null;

    protected onLoad(): void {
        this._proxy = MapCommand.getInstance().proxy;
        this._parentLayer = this.tiledMap.getLayer("army");
        let position: cc.Vec2 = this._proxy.mapCellToPixelPoint(cc.v2(0, 0));
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
        let guid: number = this.tiledMap.getLayer("ground").getTileGIDAt(mapPoint);
        console.log("onTouchMap guid ", guid);
        if (guid > 0) {
            //不可行走区域
            console.log("不可行走区域 山或者水(" + mapPoint.x + " , " + mapPoint.y + ")");
        } else {
            console.log("可行走区域(" + mapPoint.x + " , " + mapPoint.y + ")");
        }
    }
}