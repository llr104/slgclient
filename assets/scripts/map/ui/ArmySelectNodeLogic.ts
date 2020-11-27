import ArmyCommand from "../../general/ArmyCommand";
import { ArmyData } from "../../general/ArmyProxy";
import { MapCityData } from "../MapCityProxy";
import MapCommand from "../MapCommand";
import ArmySelectItemLogic from "./ArmySelectItemLogic";

const { ccclass, property } = cc._decorator;

@ccclass
export default class ArmySelectNodeLogic extends cc.Component {
    @property(cc.Node)
    armyContainer: cc.Node = null;
    @property(cc.Prefab)
    itemPrefab: cc.Prefab = null;
    
    protected onLoad(): void {
        cc.systemEvent.on("close_army_select_ui", this.onClickBack, this);
    }

    protected onDestroy(): void {
        cc.systemEvent.targetOff(this);
    }

    protected onClickBack(): void {
        this.node.active = false;
    }

    public setData(cmd: number, x: number, y: number): void {
        this.armyContainer.removeAllChildren(true);
        let myCity: MapCityData = MapCommand.getInstance().cityProxy.getMyMainCity();
        let armyList: ArmyData[] = ArmyCommand.getInstance().proxy.getArmyList(myCity.cityId);
        for (let i: number = 0; i < armyList.length; i++) {
            if (armyList[i]) {
                let item: cc.Node = cc.instantiate(this.itemPrefab);
                item.parent = this.armyContainer;
                item.getComponent(ArmySelectItemLogic).setArmyData(armyList[i], cmd, x, y);
            }
        }
    }
}