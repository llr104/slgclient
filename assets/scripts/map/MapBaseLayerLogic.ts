import MapCommand from "./MapCommand";

const { ccclass, property } = cc._decorator;

@ccclass
export default class MapBaseLayerLogic extends cc.Component {
    @property(cc.Node)
    parentLayer: cc.Node = null;
    @property(cc.Prefab)
    entryPrefab: cc.Prefab = null;

    protected _cmd: MapCommand;
    protected _itemPool: cc.NodePool = new cc.NodePool();
    protected _itemMap: Map<number, Map<number, cc.Node>> = new Map<number, Map<number, cc.Node>>();

    protected onLoad(): void {
        this._cmd = MapCommand.getInstance();
    }

    protected onDestroy(): void {
        this._cmd = null;
        this._itemMap.forEach((value: Map<number, cc.Node>, key: number) => {
            value.clear();
        });
        this._itemMap.clear();
        this._itemMap = null;
        this._itemPool.clear();
        this._itemPool = null;
    }

    public addItem(areaIndex: number, data: any): cc.Node {
        let item: cc.Node = this.createItem();
        item.parent = this.parentLayer;
        this.updateItem(areaIndex, data, item);

        let list: Map<number, cc.Node> = this._itemMap.get(areaIndex);
        list.set(this.getIdByData(data), item);
        return item;
    }

    public updateItem(areaIndex: number, data: any, item: cc.Node = null): void {
        let realItem: cc.Node = item;
        if (item == null) {
            let id: number = this.getIdByData(data);
            realItem = this.getItem(id, areaIndex);
        }
        if (realItem) {
            this.setItemData(realItem, data);
        }
    }

    public setItemData(item: cc.Node, data: any): void {

    }

    public removeItem(id: number, areaIndex: number): boolean {
        let list: Map<number, cc.Node> = this._itemMap.get(areaIndex);
        if (list.has(id)) {
            let item: cc.Node = list.get(id);
            this._itemPool.put(item);
            list.delete(id);
            return true;
        }
        return false;
    }

    public getItem(id: number, areaIndex: number): cc.Node {
        let list: Map<number, cc.Node> = this._itemMap.get(areaIndex);
        if (list.has(id)) {
            return list.get(id);
        }
        return null;
    }

    protected createItem(): cc.Node {
        if (this._itemPool.size() > 0) {
            return this._itemPool.get();
        }
        let node: cc.Node = cc.instantiate(this.entryPrefab);
        return node;
    }

    public removeArea(areaIndex: number): void {
        if (this._itemMap.has(areaIndex)) {
            let list: Map<number, cc.Node> = this._itemMap.get(areaIndex);
            list.forEach((node: cc.Node, key: number) => {
                this._itemPool.put(node);
            });
            list.clear();
            this._itemMap.delete(areaIndex);
        }
    }

    public addArea(areaIndex: number): void {
        if (this._itemMap.has(areaIndex) == false) {
            this._itemMap.set(areaIndex, new Map<number, cc.Node>());
        }
    }

    public udpateShowAreas(addIndexs: number[], removeIndexs: number[]): void {
        for (let i: number = 0; i < removeIndexs.length; i++) {
            this.removeArea(removeIndexs[i]);
        }
        for (let i: number = 0; i < addIndexs.length; i++) {
            this.addArea(addIndexs[i]);
        }
    }

    public initNodeByArea(areaIndex: number): void {

    }

    public getIdByData(data: any): number {
        return data.id;
    }
}