import ArmyCommand from "../../general/ArmyCommand";
import { ArmyData } from "../../general/ArmyProxy";
import { MapCityData } from "../MapCityProxy";
import CityArmyItemLogic from "./CityArmyItemLogic";
import MapUICommand from "./MapUICommand";
import { CityAddition } from "./MapUIProxy";

const { ccclass, property } = cc._decorator;

@ccclass
export default class CityAboutLogic extends cc.Component {
    @property(cc.Node)
    armyLayer: cc.Node = null;
    @property(cc.Prefab)
    armyItem: cc.Prefab = null;

    protected _armyCnt: number = 5;//队伍数量 固定值
    protected _cityData: MapCityData = null;
    protected _armyComps: CityArmyItemLogic[] = [];

    protected onLoad(): void {
        this.initView();
        cc.systemEvent.on("update_city_addition", this.onUpdateCityAdditon, this);
    }

    protected onDestroy(): void {
        cc.systemEvent.targetOff(this);
    }

    protected initView(): void {
        for (let i: number = 0; i < this._armyCnt; i++) {
            let item = cc.instantiate(this.armyItem);
            item.parent = this.armyLayer;
            let comp: CityArmyItemLogic = item.getComponent(CityArmyItemLogic);
            comp.order = i + 1;
            this._armyComps.push(comp);
        }
    }

    protected onUpdateCityAdditon(cityId: number): void {
        if (this._cityData.cityId == cityId) {
            this.updateArmyList();
        }
    }

    protected updateArmyList(): void {
        let additon: CityAddition = MapUICommand.getInstance().proxy.getMyCityAddition(this._cityData.cityId);
        let armyList: ArmyData[] = ArmyCommand.getInstance().proxy.getArmyList(this._cityData.cityId);
        for (let i: number = 0; i < this._armyComps.length; i++) {
            if (i >= additon.armyCnt) {
                //未开启
                this._armyComps[i].isOpenedArmy(false);
            } else {
                //已开启
                this._armyComps[i].isOpenedArmy(true);
                this._armyComps[i].setArmyData(this._cityData.cityId, armyList[i]);
            }
        }
    }

    public setData(data: MapCityData): void {
        this._cityData = data;
        this.updateArmyList();
        MapUICommand.getInstance().qryCityFacilities(this._cityData.cityId);
    }


    protected onClickFacility(): void {
        //设施
        cc.systemEvent.emit("open_facility", this._cityData);
    }

    protected onClickVisit(): void {
        //寻访
    }

    protected onClickAppoint(): void {
        //委任
    }

    protected onClickForge(): void {
        //锻造
    }

    protected onClickTrainHorse(): void {
        //训马
    }

    protected onClickTrain(): void {
        //练兵
    }

    protected onClickClose(): void {
        this.node.active = false;
    }
}
