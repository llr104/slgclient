import ResLogic from "./entries/ResLogic";
import MapEntryLayerLogic from "./MapEntryLayerLogic";
import { MapResConfig, MapResType } from "./MapProxy";

const { ccclass, property } = cc._decorator;

@ccclass
export default class MapResLogic extends MapEntryLayerLogic {

    protected onLoad(): void {
        super.onLoad();
    }

    protected onDestroy(): void {
        super.onDestroy();
    }

    public addEntry(x: number, y: number): void {
        let resDataList: Array<Array<MapResConfig>> = this._cmd.proxy.mapResConfigs;
        if (resDataList[x][y].type >= MapResType.WOOD) {
            super.addEntry(x, y);
        }
    }

    public updateEntry(node: cc.Node, x: number, y: number): void {
        let resDataList: Array<Array<MapResConfig>> = this._cmd.proxy.mapResConfigs;
        node.getComponent(ResLogic).setResourceData(resDataList[x][y]);
    }
}