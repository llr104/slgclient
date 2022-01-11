import { _decorator, Component, Node, Prefab, NodePool, instantiate } from 'cc';
const { ccclass, property } = _decorator;

import MapCommand from "./MapCommand";

@ccclass('MapBaseLayerLogic')
export default class MapBaseLayerLogic extends Component {
    @property(Node)
    parentLayer: Node = null;
    @property(Prefab)
    entryPrefab: Prefab = null;

    protected _cmd: MapCommand;
    protected _itemPool: NodePool = new NodePool();
    protected _itemMap: Map<number, Map<number, Node>> = new Map<number, Map<number, Node>>();

    protected onLoad(): void {
        this._cmd = MapCommand.getInstance();
    }

    protected onDestroy(): void {
        this._cmd = null;
        this._itemMap.forEach((value: Map<number, Node>, key: number) => {
            value.clear();
        });
        this._itemMap.clear();
        this._itemMap = null;
        this._itemPool.clear();
        this._itemPool = null;
    }

    public addItem(areaIndex: number, data: any): Node {
        if (this._itemMap.has(areaIndex)) {
            let id: number = this.getIdByData(data);
            let item: Node = this.getItem(areaIndex, id);
            if (item == null) {
                item = this.createItem();
                item.parent = this.parentLayer;
                let list: Map<number, Node> = this._itemMap.get(areaIndex);
                list.set(this.getIdByData(data), item);
            }
            this.updateItem(areaIndex, data, item);
            return item;
        }
        return null;
    }

    public updateItem(areaIndex: number, data: any, item: Node = null): void {
        
        if (this._itemMap.has(areaIndex)) {
            let realItem: Node = item;
            if (item == null) {
                let id: number = this.getIdByData(data);
                realItem = this.getItem(areaIndex, id);
            }
            if (realItem) {
                this.setItemData(realItem, data);
            }
        }
    }

    //子类重写
    public setItemData(item: Node, data: any): void {

    }

    public removeItem(areaIndex: number, id: number): boolean {
        let list: Map<number, Node> = this._itemMap.get(areaIndex);
        if (list.has(id)) {
            let item: Node = list.get(id);
            this._itemPool.put(item);
            list.delete(id);
            return true;
        }
        return false;
    }

    public getItem(areaIndex: number, id: number): Node {
        let list: Map<number, Node> = this._itemMap.get(areaIndex);
        if (list.has(id)) {
            return list.get(id);
        }
        return null;
    }

    protected createItem(): Node {
        if (this._itemPool.size() > 0) {
            return this._itemPool.get();
        }
        let node: Node = instantiate(this.entryPrefab);
        return node;
    }

    public removeArea(areaIndex: number): void {
        if (this._itemMap.has(areaIndex)) {
            let list: Map<number, Node> = this._itemMap.get(areaIndex);
            list.forEach((node: Node, key: number) => {
                this._itemPool.put(node);
            });
            list.clear();
            this._itemMap.delete(areaIndex);
        }
    }

    public addArea(areaIndex: number): void {
        if (this._itemMap.has(areaIndex) == false) {
            this._itemMap.set(areaIndex, new Map<number, Node>());
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
