import { _decorator, Component, Node, Prefab, instantiate } from 'cc';
const { ccclass, property } = _decorator;

import ArmyCommand from "../../general/ArmyCommand";
import { ArmyData } from "../../general/ArmyProxy";
import { MapCityData } from "../MapCityProxy";
import MapCommand from "../MapCommand";
import ArmySelectItemLogic from "./ArmySelectItemLogic";
import { EventMgr } from '../../utils/EventMgr';

@ccclass('ArmySelectNodeLogic')
export default class ArmySelectNodeLogic extends Component {
    @property(Node)
    armyContainer: Node = null;
    @property(Prefab)
    itemPrefab: Prefab = null;
    
    protected onLoad(): void {
        EventMgr.on("close_army_select_ui", this.onClickBack, this);
    }

    protected onDestroy(): void {
        EventMgr.targetOff(this);
    }

    protected onClickBack(): void {
        this.node.active = false;
    }

    public setData(cmd: number, x: number, y: number): void {
        this.armyContainer.removeAllChildren();
        let myCity: MapCityData = MapCommand.getInstance().cityProxy.getMyMainCity();
        let armyList: ArmyData[] = ArmyCommand.getInstance().proxy.getArmyList(myCity.cityId);
        for (let i: number = 0; i < armyList.length; i++) {
            if (armyList[i] && armyList[i].generals[0] > 0) {
                let item: Node = instantiate(this.itemPrefab);
                item.parent = this.armyContainer;
                item.getComponent(ArmySelectItemLogic).setArmyData(armyList[i], cmd, x, y);
            }
        }
    }
}
