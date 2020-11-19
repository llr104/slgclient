import ResLogic from "./entries/ResLogic";
import MapBaseLayerLogic from "./MapBaseLayerLogic";
import { MapResData } from "./MapProxy";
import MapUtil from "./MapUtil";

const { ccclass, property } = cc._decorator;

@ccclass
export default class MapResLogic extends MapBaseLayerLogic {

    protected onLoad(): void {
        super.onLoad();
    }

    protected onDestroy(): void {
        super.onDestroy();
    }

    public setItemData(item: cc.Node, data: any): void {
        let resData: MapResData = data as MapResData;
        let position: cc.Vec2 = MapUtil.mapCellToPixelPoint(cc.v2(resData.x, resData.y));
        item.setPosition(position);
        item.getComponent(ResLogic).setResourceData(resData);
    }
}