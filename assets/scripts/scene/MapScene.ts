import MapCommand from "../map/MapCommand";
import MapLogic from "../map/MapLogic";
import { MapRect } from "../map/MapProxy";
import MapResLogic from "../map/MapResLogic";

const { ccclass, property } = cc._decorator;

@ccclass
export default class MapScene extends cc.Component {
    @property(cc.Node)
    mapLayer: cc.Node = null;
    @property(cc.Node)
    resLayer: cc.Node = null;
    @property(cc.Node)
    buildLayer: cc.Node = null;
    @property(cc.Node)
    armyLayer: cc.Node = null;

    protected _cmd: MapCommand = null;

    protected onLoad(): void {
        this._cmd = MapCommand.getInstance();
        cc.systemEvent.on("map_center_change", this.onCenterChange, this);
        this.scheduleOnce(() => {
            let centerPoint: cc.Vec2 = MapCommand.getInstance().proxy.getMyMainCity().position;
            this.node.getComponent(MapLogic).scrollToMapPoint(centerPoint);
        });
    }

    protected onDestroy(): void {
        cc.systemEvent.targetOff(this);
    }

    protected onCenterChange(centerPoint: cc.Vec2, showRect: MapRect, oldRect: MapRect): void {
        if (oldRect != null) {
            for (let x: number = oldRect.minX; x <= oldRect.maxX; x++) {
                for (let y: number = oldRect.minY; y <= oldRect.maxY; y++) {
                    if (showRect.contains(x, y) == false) {
                        this.node.getComponent(MapResLogic).removeEntry(x, y);
                    }
                }
            }
        }

        for (let x: number = showRect.minX; x <= showRect.maxX; x++) {
            for (let y: number = showRect.minY; y <= showRect.maxY; y++) {
                this.node.getComponent(MapResLogic).addEntry(x, y);
            }
        }
        this._cmd.qryNationMapScan(centerPoint);
    }
}
