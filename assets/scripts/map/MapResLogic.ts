import ResLogic from "./entries/ResLogic";
import MapBaseLayerLogic from "./MapBaseLayerLogic";
import { MapAreaData, MapResConfig, MapResType } from "./MapProxy";

const { ccclass, property } = cc._decorator;

@ccclass
export default class MapResLogic extends MapBaseLayerLogic {

    protected onLoad(): void {
        super.onLoad();
    }

    protected onDestroy(): void {
        super.onDestroy();
    }

    public updateNodeByArea(areaIndex: number): void {
        let resDataList: Array<Array<MapResConfig>> = this._cmd.proxy.mapResConfigs;
        let areaData: MapAreaData = this._cmd.proxy.getMapAreaData(areaIndex);
        for (let x: number = areaData.startX; x < areaData.len + areaData.startX; x++) {
            for (let y: number = areaData.startY; y < areaData.len + areaData.startY; y++) {
                if (resDataList[x][y].type >= MapResType.WOOD) {
                    let item: cc.Node = this.addItem(areaIndex, resDataList[x][y]);
                    let position: cc.Vec2 = this._cmd.proxy.mapCellToPixelPoint(cc.v2(x, y));
                    item.setPosition(position);
                }
            }
        }
    }

    public updateEntry(node: cc.Node, data: any): void {
        node.getComponent(ResLogic).setResourceData(data);
    }

    public setItemData(item: cc.Node, data: any): void {
        let resData: MapResConfig = data as MapResConfig;
        item.getComponent(ResLogic).setResourceData(resData);
    }
}