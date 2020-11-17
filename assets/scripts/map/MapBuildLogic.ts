import MapEntryLayerLogic from "./MapEntryLayerLogic";

const { ccclass, property } = cc._decorator;

@ccclass
export default class MapBuildLogic extends MapEntryLayerLogic {

    protected onLoad(): void {
        super.onLoad();
        cc.systemEvent.on("update_builds", this.onUpdateBuilds, this);
    }

    protected onDestroy(): void {
        cc.systemEvent.targetOff(this);
        super.onDestroy();
    }

    protected onUpdateBuilds(areaIndex: number): void {
        this.removeArea(areaIndex);
        this.updateNodeByArea(areaIndex);
    }

    public updateNodeByArea(areaIndex: number): void {

    }

    public updateEntry(node: cc.Node, data: any): void {

    }
}