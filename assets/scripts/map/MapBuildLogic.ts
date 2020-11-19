import BuildLogic from "./entries/BuildLogic";
import MapBaseLayerLogic from "./MapBaseLayerLogic";
import { MapBuildData } from "./MapProxy";
import MapUtil from "./MapUtil";

const { ccclass, property } = cc._decorator;

@ccclass
export default class MapBuildLogic extends MapBaseLayerLogic {

    protected onLoad(): void {
        super.onLoad();
        cc.systemEvent.on("update_builds", this.onUpdateBuilds, this);
    }

    protected onDestroy(): void {
        cc.systemEvent.targetOff(this);
        super.onDestroy();
    }

    protected onUpdateBuilds(areaIndex: number, addIds: number[], removeIds: number[], updateIds: number[]): void {
        // console.log("update_builds", arguments);
        if (this._itemMap.has(areaIndex)) {
            for (let i: number = 0; i < addIds.length; i++) {
                this.addItem(areaIndex, this._cmd.proxy.getBuild(addIds[i]));
            }
            for (let i: number = 0; i < removeIds.length; i++) {
                this.removeItem(areaIndex, removeIds[i]);
            }
            for (let i: number = 0; i < updateIds.length; i++) {
                this.updateItem(areaIndex, this._cmd.proxy.getBuild(updateIds[i]));
            }
        }
    }

    public setItemData(item: cc.Node, data: any): void {
        let buildData: MapBuildData = data as MapBuildData;
        let position: cc.Vec2 = MapUtil.mapCellToPixelPoint(cc.v2(buildData.x, buildData.y));
        item.setPosition(position);
        item.getComponent(BuildLogic).setBuildData(buildData);
    }
}