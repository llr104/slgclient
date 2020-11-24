import { ArmyData } from "../../general/ArmyProxy";
import ArmyCommand from "../../general/ArmyCommand";
import MapCommand from "../MapCommand";
import RightArmyItemLogic from "./RightArmyItemLogic";
import { MapCityData } from "../MapCityProxy";
import RightCityItemLogic from "./RightCityItemLogic";

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
    @property(cc.Prefab)
    cityItemPrefabs: cc.Prefab = null;

    protected _armys: cc.Node[] = [];
    protected _citys: cc.Node[] = [];

    protected onLoad(): void {
        cc.systemEvent.on("update_army_list", this.onUpdateArmyList, this);
        cc.systemEvent.on("update_army", this.onUpdateArmy, this);
        this.armyScrollView.node.active = true;
        this.cityScrollView.node.active = false;
        this.initArmys();
        this.initCitys();
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
                item.getComponent(RightArmyItemLogic).setArmyData(datas[i]);
            }
        }
    }

    protected initCitys():void {
        let citys: MapCityData[] = MapCommand.getInstance().cityProxy.getMyCitys();
        this.cityScrollView.content.removeAllChildren(true);
        if (citys && citys.length > 0) {
            this._citys.length = 0;
            for (let i: number = 0; i < citys.length; i++) {
                let item: cc.Node = cc.instantiate(this.cityItemPrefabs);
                item.parent = this.cityScrollView.content;
                this._armys.push(item);
                item.getComponent(RightCityItemLogic).setArmyData(citys[i]);
            }
        }
    }

    protected onUpdateArmyList(datas: ArmyData[]): void {
        this.initArmys();
    }

    protected onUpdateArmy(data: ArmyData): void {
        if (MapCommand.getInstance().cityProxy.getMyMainCity().cityId == data.cityId) {
            this._armys[data.order - 1].getComponent(RightArmyItemLogic).setArmyData(data);
        }
    }

    onClockToggle(toggle: cc.Toggle): void {
        let index: number = this.toggles.indexOf(toggle);
        if (index == 1) {
            this.armyScrollView.node.active = false;
            this.cityScrollView.node.active = true;
        } else {
            this.armyScrollView.node.active = true;
            this.cityScrollView.node.active = false;
        }
    }
}