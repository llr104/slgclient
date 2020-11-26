import ArmyCommand from "../general/ArmyCommand";
import { ArmyData } from "../general/ArmyProxy";
import ArmyLogic from "./entries/ArmyLogic";
import MapCommand from "./MapCommand";

const { ccclass, property } = cc._decorator;

@ccclass
export default class MapArmyLogic extends cc.Component {
    @property(cc.Node)
    parentLayer: cc.Node = null;
    @property(cc.Prefab)
    armyPrefab: cc.Prefab = null;

    protected _armys: Map<number, cc.Node> = new Map<number, cc.Node>();
    protected _armyPool: cc.NodePool = new cc.NodePool();

    protected onLoad(): void {
        cc.systemEvent.on("update_army_list", this.onUpdateArmyList, this);
        cc.systemEvent.on("update_army", this.onUpdateArmy, this);
        this.initArmys();
    }

    protected onDestroy(): void {
        cc.systemEvent.targetOff(this);
    }

    protected initArmys(): void {
        let cityId: number = MapCommand.getInstance().cityProxy.getMyMainCity().cityId;
        let datas: ArmyData[] = ArmyCommand.getInstance().proxy.getArmyList(cityId);
        console.log("initArmys", datas);
        if (datas) {
            this.onUpdateArmyList(datas);
        }
    }

    protected onUpdateArmyList(datas: ArmyData[]): void {
        for (let i:number = 0; i < datas.length; i++) {
            if (datas[i] && datas[i].cmd > 0) {
                this.onUpdateArmy(datas[i]);
            }
        }
    }

    protected onUpdateArmy(data: ArmyData): void {
        console.log("update_army", data);
        let node: cc.Node = null;
        if (data.cmd == 0) {
            //代表不在地图上
            this.removeArmyById(data.id);
            return;
        }
        if (this._armys.has(data.id) == false) {
            node = this.createArmy();
            node.parent = this.parentLayer;
            this._armys.set(data.id, node);
        } else {
            node = this._armys.get(data.id);
        }
        node.getComponent(ArmyLogic).setArmyData(data);
    }

    protected createArmy(): cc.Node {
        if (this._armyPool.size() > 0) {
            return this._armyPool.get();
        } else {
            return cc.instantiate(this.armyPrefab);
        }
    }

    protected removeArmyById(id: number): void {
        if (this._armys.has(id)) {
            let node:cc.Node = this._armys.get(id);
            this._armyPool.put(node);
            this._armys.delete(id);
            console.log("removeArmyById", id, node);
        }
    }
}