import { _decorator, Node, Vec2, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

import ResBuildLogic from "./entries/ResBuildLogic";
import MapBaseLayerLogic from "./MapBaseLayerLogic";
import { MapBuildData } from "./MapBuildProxy";
import MapUtil from "./MapUtil";
import { EventMgr } from '../utils/EventMgr';
import { LogicEvent } from '../common/LogicEvent';

@ccclass('MapResBuildLogic')
export default class MapResBuildLogic extends MapBaseLayerLogic {

    protected onLoad(): void {
        super.onLoad();
        EventMgr.on(LogicEvent.updateBuilds, this.onUpdateBuilds, this);
        EventMgr.on(LogicEvent.updateBuild, this.onUpdateBuild, this);
        EventMgr.on(LogicEvent.deleteBuild, this.onDeleteBuild, this);

    }

    protected onDestroy(): void {
        EventMgr.targetOff(this);
        super.onDestroy();
    }

    protected onUpdateBuilds(areaIndex: number, addIds: number[], removeIds: number[], updateIds: number[]): void {
  
        if (this._itemMap.has(areaIndex)) {
            for (let i: number = 0; i < addIds.length; i++) {
                this.addItem(areaIndex, this._cmd.buildProxy.getBuild(addIds[i]));
            }
            for (let i: number = 0; i < removeIds.length; i++) {
                this.removeItem(areaIndex, removeIds[i]);
            }
            for (let i: number = 0; i < updateIds.length; i++) {
                this.updateItem(areaIndex, this._cmd.buildProxy.getBuild(updateIds[i]));
            }
        }
    }

    protected onUpdateBuild(data: MapBuildData): void {

        let areaIndex: number = MapUtil.getAreaIdByCellPoint(data.x, data.y);
        this.addItem(areaIndex, data);
    }

    protected onDeleteBuild(id: number, x: number, y: number): void {
        let areaIndex: number = MapUtil.getAreaIdByCellPoint(x, y);
        this.removeItem(areaIndex, id);
    }

    public setItemData(item: Node, data: any): void {
        let buildData: MapBuildData = data as MapBuildData;
        let position: Vec2 = MapUtil.mapCellToPixelPoint(new Vec2(buildData.x, buildData.y));
        item.setPosition(new Vec3(position.x, position.y, 0));
        item.getComponent(ResBuildLogic).setBuildData(buildData);
    }
}
