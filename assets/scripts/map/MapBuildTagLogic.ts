import { _decorator, Node, Vec2, Vec3 } from 'cc';
const { ccclass } = _decorator;

import BuildTagLogic from "./entries/BuildTagLogic";
import MapBaseLayerLogic from "./MapBaseLayerLogic";
import { MapResData } from "./MapProxy";
import MapUtil from "./MapUtil";

@ccclass('MapBuildTagLogic')
export default class MapBuildTagLogic extends MapBaseLayerLogic {

    protected onLoad(): void {
        super.onLoad();
    }

    protected onDestroy(): void {
        super.onDestroy();
    }

    public setItemData(item: Node, data: any): void {
        let resData: MapResData = data as MapResData;
        let position: Vec2 = MapUtil.mapCellToPixelPoint(new Vec2(resData.x, resData.y));
        item.setPosition(new Vec3(position.x, position.y, 0));
        item.getComponent(BuildTagLogic).setResourceData(resData);
    }
}
