import { _decorator, Component, Toggle, ScrollView, Prefab, Node, instantiate } from 'cc';
const { ccclass, property } = _decorator;

import { ArmyData } from "../../general/ArmyProxy";
import ArmyCommand from "../../general/ArmyCommand";
import MapCommand from "../MapCommand";
import RightArmyItemLogic from "./RightArmyItemLogic";
import { MapCityData } from "../MapCityProxy";
import RightCityItemLogic from "./RightCityItemLogic";
import RightTagItemLogic from "./RightTagItemLogic";
import { EventMgr } from '../../utils/EventMgr';

@ccclass('RightInfoNodeLogic')
export default class RightInfoNodeLogic extends Component {
    @property([Toggle])
    toggles: Toggle[] = [];
    @property(ScrollView)
    armyScrollView: ScrollView = null;
    @property(ScrollView)
    cityScrollView: ScrollView = null;
    @property(ScrollView)
    tagsScrollView: ScrollView = null;

    @property(Prefab)
    armyItemPrefabs: Prefab = null;
    @property(Prefab)
    cityItemPrefabs: Prefab = null;

    @property(Prefab)
    tagItemPrefabs: Prefab = null;

    protected _armys: Node[] = [];


    protected onLoad(): void {
        EventMgr.on("update_army_list", this.onUpdateArmyList, this);
        EventMgr.on("update_army", this.onUpdateArmy, this);
        EventMgr.on("update_tag", this.onUpdateTag, this);

        this.armyScrollView.node.active = true;
        this.cityScrollView.node.active = false;
        this.tagsScrollView.node.active = false;
        this.initArmys();
        this.initCitys();
        this.initTags();
    }

    protected onDestroy(): void {
        EventMgr.targetOff(this);
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
                let item: Node = instantiate(this.armyItemPrefabs);
                item.parent = this.armyScrollView.content;
                this._armys[i] = item;
                item.getComponent(RightArmyItemLogic).order = i + 1;
                item.getComponent(RightArmyItemLogic).setArmyData(datas[i]);
            }
        }
    }

    protected initCitys():void {
        let citys: MapCityData[] = MapCommand.getInstance().cityProxy.getMyCitys();
        this.cityScrollView.content.removeAllChildren();
        if (citys && citys.length > 0) {
            for (let i: number = 0; i < citys.length; i++) {
                let item: Node = instantiate(this.cityItemPrefabs);
                item.parent = this.cityScrollView.content;
                item.getComponent(RightCityItemLogic).setArmyData(citys[i]);
            }
        }
    }

    protected initTags(): void {
        let tags = MapCommand.getInstance().proxy.getPosTags();
        this.tagsScrollView.content.removeAllChildren();
        for (let i: number = 0; i < tags.length; i++) {
            var tag = tags[i];

            
            let item: Node = instantiate(this.tagItemPrefabs);
            item.parent = this.tagsScrollView.content;
            item.getComponent(RightTagItemLogic).setData(tag);
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

    protected onUpdateTag():void {
        this.initTags();
    }

    onClockToggle(toggle: Toggle): void {
        let index: number = this.toggles.indexOf(toggle);
        if (index == 1) {
            this.armyScrollView.node.active = false;
            this.cityScrollView.node.active = true;
            this.tagsScrollView.node.active = false;
        } else if(index == 0){
            this.armyScrollView.node.active = true;
            this.cityScrollView.node.active = false;
            this.tagsScrollView.node.active = false;
        }else{
            this.armyScrollView.node.active = false;
            this.cityScrollView.node.active = false;
            this.tagsScrollView.node.active = true;
        }
    }
}
