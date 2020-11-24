import { ArmyData } from "../../general/ArmyProxy";
import ArmyCommand from "../../general/ArmyCommand";
import MapCommand from "../MapCommand";
import LeftArmyItemLogic from "./RightArmyItemLogic";

const { ccclass, property } = cc._decorator;

@ccclass
export default class RightInfoNodeLogic extends cc.Component {
    @property([cc.Toggle])
    toggles: cc.Toggle[] = [];
    @property(cc.ScrollView)
    armyScrollView: cc.ScrollView = null;
    @property(cc.ScrollView)
    cityScrollView: cc.ScrollView = null;
    @property(cc.Prefab)
    armyItemPrefabs: cc.Prefab = null;

    protected _armys: cc.Node[] = [];
    protected _ar

    protected onLoad(): void {
        cc.systemEvent.on("update_army_list", this.onUpdateArmyList, this);
        cc.systemEvent.on("update_army", this.onUpdateArmy, this);
        this.armyScrollView.node.active = true;
        this.cityScrollView.node.active = false;
        this.initArmys();
    }

    protected onDestroy(): void {
        cc.systemEvent.targetOff(this);
        this._armys.length = 0;
        this._armys = null;
    }

    protected initArmys(): void {
        let cityId: number = MapCommand.getInstance().cityProxy.getMyMainCity().cityId;
        let datas: ArmyData[] = ArmyCommand.getInstance().proxy.getArmyList(cityId);
        this.armyScrollView.content.removeAllChildren(true);
        console.log("datas", datas);
        if (datas) {
            this._armys.length = datas.length;
            for (let i: number = 0; i < datas.length; i++) {
                let item: cc.Node = cc.instantiate(this.armyItemPrefabs);
                item.parent = this.armyScrollView.content;
                this._armys[i] = item;
                item.getComponent(LeftArmyItemLogic).setArmyData(datas[i]);
            }
        }
    }

    protected onUpdateArmyList(datas: ArmyData[]): void {
        this.initArmys();
    }

    protected onUpdateArmy(data: ArmyData): void {
        if (MapCommand.getInstance().cityProxy.getMyMainCity().cityId == data.cityId) {
            this._armys[data.order - 1].getComponent(LeftArmyItemLogic).setArmyData(data);
        }
    }

    onClockToggle(toggle: cc.Toggle): void {
        let index: number = this.toggles.indexOf(toggle);
        if (index == 1) {
            this.armyScrollView.node.active = true;
            this.cityScrollView.node.active = false;
        } else {
            this.armyScrollView.node.active = false;
            this.cityScrollView.node.active = true;
        }
    }
}