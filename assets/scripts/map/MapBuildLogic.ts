import MapCommand from "./MapCommand";
import ResourceLogic from "./ResourceLogic";
import { MapResConfig, MapResType, MapShowLimitRect } from "./MapProxy";

const { ccclass, property } = cc._decorator;

@ccclass
export default class MapResourceLogic extends cc.Component {
    @property(cc.TiledMap)
    tiledMap: cc.TiledMap = null;
    @property(cc.Prefab)
    resPrefab: cc.Prefab = null;

    protected _cmd: MapCommand
    protected _resList: { [key: string]: cc.Node } = {};

    protected onLoad(): void {
        console.log("MapResourceLogic onLoad");
        this._cmd = MapCommand.getInstance();
        cc.systemEvent.on("map_center_change", this.updateView, this);
        this.scheduleOnce(this.updateView, 0.1);
    }

    protected onDestroy(): void {
        cc.systemEvent.targetOff(this);
        this._cmd = null;
    }

    protected updateView(): void {
        // return;
        let resDataList: Array<Array<MapResConfig>> = this._cmd.proxy.mapResConfigs;
        let curShowLimit: MapShowLimitRect = this._cmd.proxy.getCurShowLimit();
        let layer: cc.TiledLayer = this.tiledMap.getLayer("ground");
        console.log("MapResourceLogic curShowLimit", curShowLimit.minX, curShowLimit.maxX, curShowLimit.minY, curShowLimit.maxY);
        for (let x: number = curShowLimit.minX; x <= curShowLimit.maxX; x++) {
            for (let y: number = curShowLimit.minY; y <= curShowLimit.maxY; y++) {
                if (resDataList[x][y].type >= MapResType.WOOD) {
                    let key: string = x + "_" + y;
                    let node: cc.Node = this._resList[key];
                    if (node == undefined) {
                        node = cc.instantiate(this.resPrefab);
                        node.parent = layer.node;
                        this._resList[key] = node;
                        node.setPosition(this._cmd.proxy.mapCellToPixelPoint(cc.v2(x, y)));
                        node.getComponent(ResourceLogic).setResourceData(resDataList[x][y]);
                        console.log("MapResourceLogic updateView", x, y, resDataList[x][y].type, node.x, node.y);
                    }

                }
            }
        }
        console.log("this._resList", this._resList);
    }
}