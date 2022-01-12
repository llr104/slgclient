import { _decorator, Component, Node, Prefab, NodePool, instantiate } from 'cc';
const { ccclass, property } = _decorator;

import ArmyCommand from "../general/ArmyCommand";
import { ArmyCmd, ArmyData } from "../general/ArmyProxy";
import ArmyLogic from "./entries/ArmyLogic";
import MapCommand from "./MapCommand";
import MapUtil from "./MapUtil";
import { EventMgr } from '../utils/EventMgr';

@ccclass('MapArmyLogic')
export default class MapArmyLogic extends Component {
    @property(Node)
    parentLayer: Node = null;
    @property(Prefab)
    armyPrefab: Prefab = null;
    @property(Prefab)
    arrowPrefab: Prefab = null;

    protected _armyLogics: Map<number, ArmyLogic> = new Map<number, ArmyLogic>();
    protected _armyPool: NodePool = new NodePool();
    protected _arrowPool: NodePool = new NodePool();

    protected onLoad(): void {
        EventMgr.on("update_army_list", this.onUpdateArmyList, this);
        EventMgr.on("update_army", this.onUpdateArmy, this);
        this.initArmys();

        this.schedule(this.checkVisible, 0.5);
    }

    protected onDestroy(): void {
        EventMgr.targetOff(this);
        this._armyPool.clear();
        this._arrowPool.clear();
        this._armyLogics.forEach((logic:ArmyLogic) => {
            logic.destroy();
        })
    }

    protected update():void {
        this._armyLogics.forEach((logic:ArmyLogic) => {
            logic.update();
        });
    }

    protected initArmys(): void {
        let datas: ArmyData[] = ArmyCommand.getInstance().proxy.getAllArmys();
        if (datas && datas.length > 0) {
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
        let aniNode: Node = null;
        let arrowNode: Node = null;
        if (data.cmd == ArmyCmd.Idle || data.cmd == ArmyCmd.Conscript) {
            //代表不在地图上
            this.removeArmyById(data.id);
            return;
        }
        let logic:ArmyLogic = this._armyLogics.get(data.id);
        console.log("onUpdateArmy 1111:", logic);

        if (logic == null) {
            logic = new ArmyLogic();
            aniNode = this.createArmy();
            aniNode.zIndex = 1;
            aniNode.parent = this.parentLayer;
            arrowNode = this.createArrow();
            arrowNode.zIndex = 2;
            arrowNode.parent = this.parentLayer;
            this._armyLogics.set(data.id, logic);

            console.log("onUpdateArmy 2222:", logic);
        } else {
            aniNode = logic.aniNode;
            arrowNode = logic.arrowNode;
            logic = this._armyLogics.get(data.id);
        }
        console.log("onUpdateArmy 3333:", logic);
        logic.setArmyData(data, aniNode, arrowNode);
    }

    protected createArmy(): Node {
        if (this._armyPool.size() > 0) {
            return this._armyPool.get();
        } else {
            return instantiate(this.armyPrefab);
        }
    }

    protected createArrow():Node {
        if (this._arrowPool.size() > 0) {
            return this._arrowPool.get();
        } else {
            return instantiate(this.arrowPrefab);
        }
    }

    protected removeArmyById(id: number): void {
        if (this._armyLogics.has(id)) {
            let logic:ArmyLogic = this._armyLogics.get(id);
            this._armyPool.put(logic.aniNode);
            this._arrowPool.put(logic.arrowNode);
            logic.clear();
            this._armyLogics.delete(id);
            console.log("removeArmyById", id);
        }
    }


    protected checkVisible(): void {

        this._armyLogics.forEach((logic:ArmyLogic) => {
            let city = MapCommand.getInstance().cityProxy.getMyCityById(logic.data.cityId);
            if(!city || city.rid != MapCommand.getInstance().buildProxy.myId){
            
                var visible1 = MapUtil.armyIsInView(logic.data.x, logic.data.y);
                var visible2 = MapUtil.armyIsInView(logic.data.toX, logic.data.toY);
                var visible3 = MapUtil.armyIsInView(logic.data.fromX, logic.data.fromY);
                if(!visible1 && !visible2 && !visible3){
                    this.removeArmyById(logic.data.id);
                }
            }
            
        });
    }
}
