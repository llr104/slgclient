const { ccclass, property } = cc._decorator;

@ccclass
export default class MapScene extends cc.Component {
    @property(cc.Prefab)
    mapPrefab: cc.Prefab = null;

    protected _mapNode: cc.Node = null;

    protected onLoad(): void {
        this.openMap();
    }

    protected onDestroy():void {
        this._mapNode = null;
    }

    protected openMap():void {
        if (this._mapNode == null) {
            this._mapNode = cc.instantiate(this.mapPrefab);
            this._mapNode.parent = this.node;
        } else {
            this._mapNode.active =  true;
        }
    }
}
