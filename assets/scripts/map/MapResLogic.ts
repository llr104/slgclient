import ResLogic from "./entries/ResLogic";
import MapEntryLayerLogic from "./MapEntryLayerLogic";
import { MapAreaData, MapResConfig, MapResType } from "./MapProxy";

const { ccclass, property } = cc._decorator;

@ccclass
export default class MapResLogic extends MapEntryLayerLogic {

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
                    this.addEntry(x, y, resDataList[x][y]);
                }
            }
        }
    }

    public updateEntry(node: cc.Node, data: any): void {
        node.getComponent(ResLogic).setResourceData(data);
    }
}