import ArmyCommand from "../general/ArmyCommand";
import { ArmyCmd, ArmyData } from "../general/ArmyProxy";
import ArmyLogic from "./entries/ArmyLogic";
import MapCommand from "./MapCommand";
import MapUtil from "./MapUtil";

const { ccclass, property } = cc._decorator;

@ccclass
export default class MapArmyLogic extends cc.Component {
    @property(cc.Node)
    parentLayer: cc.Node = null;
    @property(cc.Prefab)
    armyPrefab: cc.Prefab = null;
    @property(cc.Prefab)
    arrowPrefab: cc.Prefab = null;

    protected _armyLogics: Map<number, ArmyLogic> = new Map<number, ArmyLogic>();
    protected _armyPool: cc.NodePool = new cc.NodePool();
    protected _arrowPool: cc.NodePool = new cc.NodePool();

    protected onLoad(): void {
        cc.systemEvent.on("update_army_list", this.onUpdateArmyList, this);
        cc.systemEvent.on("update_army", this.onUpdateArmy, this);
        this.initArmys();

        this.schedule(this.checkVisible, 0.5);
    }

    protected onDestroy(): void {
        cc.systemEvent.targetOff(this);
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
        let aniNode: cc.Node = null;
        let arrowNode: cc.Node = null;
        if (data.cmd == ArmyCmd.Idle || data.cmd == ArmyCmd.Conscript) {
            //代表不在地图上
            this.removeArmyById(data.id);
            return;
        }
        let logic:ArmyLogic = this._armyLogics.get(data.id);
        if (logic == null) {
            logic = new ArmyLogic();
            aniNode = this.createArmy();
            aniNode.zIndex = 1;
            aniNode.parent = this.parentLayer;
            arrowNode = this.createArrow();
            arrowNode.zIndex = 2;
            arrowNode.parent = this.parentLayer;
            this._armyLogics.set(data.id, logic);
        } else {
            aniNode = logic.aniNode;
            arrowNode = logic.arrowNode;
            logic = this._armyLogics.get(data.id);
        }
        logic.setArmyData(data, aniNode, arrowNode);
    }

    protected createArmy(): cc.Node {
        if (this._armyPool.size() > 0) {
            return this._armyPool.get();
        } else {
            return cc.instantiate(this.armyPrefab);
        }
    }

    protected createArrow():cc.Node {
        if (this._arrowPool.size() > 0) {
            return this._arrowPool.get();
        } else {
            return cc.instantiate(this.arrowPrefab);
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