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
    protected _resMap: Map<number, Map<string, cc.Node>> = new Map<number, Map<string, cc.Node>>();

    protected onLoad(): void {
        this._cmd = MapCommand.getInstance();
    }

    protected onDestroy(): void {
        this._cmd = null;
        this._resMap.forEach((value: Map<string, cc.Node>, key: number) => {
            value.clear();
        });
        this._resMap.clear();
        this._resMap = null;
        this._resPool.clear();
        this._resPool = null;
    }

    public addEntry(x: number, y: number, data: any): void {
        let node:cc.Node = this.getEntry();
        let position:cc.Vec2 = this._cmd.proxy.mapCellToPixelPoint(cc.v2(x, y));
        node.setPosition(position);
        node.parent = this.parentLayer;
        this.updateEntry(node, data);
    }

    public updateEntry(node: cc.Node, data: any): void {
        
    }

    protected getEntry(): cc.Node {
        if (this._resPool.size() > 0) {
            return this._resPool.get();
        }
        let node: cc.Node = cc.instantiate(this.entryPrefab);
        return node;
    }

    public removeArea(areaIndex: number): void {
        if (this._resMap.has(areaIndex)) {
            let list: Map<string, cc.Node> = this._resMap.get(areaIndex);
            list.forEach((node: cc.Node, key: string) => {
                this._resPool.put(node);
            });
            list.clear();

            this._resMap.delete(areaIndex);
            console.log("removeArea", list, this._resMap)
        }
    }

    public addArea(areaIndex: number): void {
        if (this._resMap.has(areaIndex) == false) {
            this._resMap.set(areaIndex, new Map<string, cc.Node>());
        }
    }

    public udpateShowAreas(addIndexs:number[], removeIndexs:number[]): void {
        for (let i:number = 0; i < removeIndexs.length; i++) {
            this.removeArea(removeIndexs[i]);
        }
        for (let i:number = 0; i < addIndexs.length; i++) {
            this.addArea(addIndexs[i]);
            this.updateNodeByArea(addIndexs[i]);
        }
    }

    public updateNodeByArea(areaIndex: number):void {
        
    }
}