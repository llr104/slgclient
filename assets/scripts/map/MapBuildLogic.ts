import { MapResConfig, MapResType } from "./MapProxy";
import MapEntryLayerLogic from "./MapEntryLayerLogic";

const { ccclass, property } = cc._decorator;

@ccclass
export default class MapBuildLogic extends MapEntryLayerLogic {

    protected onLoad(): void {
        super.onLoad();
    }

    protected onDestroy(): void {
        super.onDestroy();
    }

    public addEntry(x: number, y: number): void {
        // let resDataList: Array<Array<MapResConfig>> = this._cmd.proxy.mapResConfigs;
        // if (resDataList[x][y].type >= MapResType.WOOD) {
        //     super.addEntry(x, y);
        // }
    }

    public updateEntry(node: cc.Node, x: number, y: number): void {
        // let resDataList: Array<Array<MapResConfig>> = this._cmd.proxy.mapResConfigs;
        // node.getComponent(ResLogic).setResourceData(resDataList[x][y]);
    }
}