import MapCommand from "./MapCommand";

const { ccclass, property } = cc._decorator;

@ccclass
export default class MapEntryLayerLogic extends cc.Component {
    @property(cc.Node)
    parentLayer: cc.Node = null;
    @property(cc.Prefab)
    entryPrefab: cc.Prefab = null;

    protected _cmd: MapCommand;
    protected _resPool: cc.NodePool = new cc.NodePool();
    protected _resList: { [key: string]: cc.Node } = {};

    protected onLoad(): void {
        this._cmd = MapCommand.getInstance();
    }

    protected onDestroy(): void {
        cc.systemEvent.targetOff(this);
        this._cmd = null;
        this._resList = null;
        this._resPool.clear();
        this._resPool = null;
    }

    protected getEntry(): cc.Node {
        if (this._resPool.size() > 0) {
            return this._resPool.get();
        }
        let node: cc.Node = cc.instantiate(this.entryPrefab);
        return node;
    }

    public removeEntry(x: number, y: number): void {
        let key: string = x + "_" + y;
        let node: cc.Node = this._resList[key];
        if (node != undefined) {
            this._resPool.put(node);
            delete this._resList[key];
        }
    }

    public addEntry(x: number, y: number): void {
        let key: string = x + "_" + y;
        let node: cc.Node = this._resList[key];
        if (node == undefined) {
            node = this.getEntry();
            node.setPosition(this._cmd.proxy.mapCellToPixelPoint(cc.v2(x, y)));
            node.parent = this.parentLayer;
            this._resList[key] = node;
            this.updateEntry(node, x, y);
        }
    }

    public updateEntry(node:cc.Node, x: number, y: number): void {

    }
}