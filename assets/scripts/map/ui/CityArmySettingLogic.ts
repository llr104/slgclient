import { ArmyData } from "../../general/ArmyProxy";
import GeneralCommand from "../../general/GeneralCommand";
import ArmyCommand from "../../general/ArmyCommand";
import { GeneralConfig, GeneralData } from "../../general/GeneralProxy";
import MapUICommand from "./MapUICommand";
import MapCommand from "../MapCommand";
import { MapCityData } from "../MapCityProxy";
import { CityAddition, ConscriptBaseCost } from "./MapUIProxy";
import CityGeneralItemLogic from "./CityGeneralItemLogic";
import LoginCommand from "../../login/LoginCommand";

const { ccclass, property } = cc._decorator;

@ccclass
export default class CityArmySettingLogic extends cc.Component {
    @property(cc.Label)
    labelId: cc.Label = null;
    @property(cc.Label)
    labelCost: cc.Label = null;
    @property(cc.Label)
    labelSoldierCnt: cc.Label = null;
    @property(cc.Label)
    labelSpeed: cc.Label = null;
    @property(cc.Label)
    labelAtkCity: cc.Label = null;
    @property(cc.Label)
    labelAddition: cc.Label = null;
    @property(cc.Label)
    labelResCost: cc.Label = null;
    @property(cc.Node)
    generalLayer: cc.Node = null;
    @property(cc.Prefab)
    generalPrefab: cc.Prefab = null;
    @property([cc.EditBox])
    editBoxs: cc.EditBox[] = [];
    @property([cc.Slider])
    sliders: cc.Slider[] = [];
    @property([cc.Node])
    tipNodes: cc.Node[] = [];

    protected _generalCnt: number = 3;
    protected _order: number = 0;
    protected _cityId: number = 0;
    protected _cityData: MapCityData = null;
    protected _isUnlock: boolean = false;
    protected _data: ArmyData = null;
    protected _condition: CityAddition = null;
    protected _gengeralLogics: CityGeneralItemLogic[] = [];
    protected _soldiers: number[] = null;
    protected _totalSoldiers: number[] = null;
    protected _curConscripts: number[] = null;//当前征兵数

    protected onLoad(): void {
        this.initView();
    }

    protected onDestroy(): void {
        this._gengeralLogics.length = 0;
    }

    protected onEnable(): void {
        this._soldiers = [0, 0, 0];
        this._totalSoldiers = [0, 0, 0];
        this._curConscripts = [0, 0, 0];

        cc.systemEvent.on("update_army", this.onUpdateArmy, this);
        cc.systemEvent.on("chosed_general", this.onChooseGeneral, this);
    }

    protected onDisable(): void {
        cc.systemEvent.targetOff(this);
        this._data = null;
        this._condition = null;
        this._cityData = null;
    }

    protected initView(): void {
        for (let i: number = 0; i < this._generalCnt; i++) {
            let item: cc.Node = cc.instantiate(this.generalPrefab);
            item.parent = this.generalLayer;
            let comp: CityGeneralItemLogic = item.getComponent(CityGeneralItemLogic);
            comp.index = i;
            this._gengeralLogics.push(comp);
            console.log("comp index", i, comp);
        }
    }

    protected clearSoldiers(): void {
        for (let i: number = 0; i < this._generalCnt; i++) {
            this._soldiers[i] = 0;
            this._totalSoldiers[i] = 0;
        }
    }

    protected onUpdateArmy(armyData: ArmyData): void {
        if (this._data && armyData.id == this._data.id) {
            this.setData(this._cityId, this._order);
        }
    }

    protected onChooseGeneral(cfgData: any, curData: any, position: any): void {
        ArmyCommand.getInstance().generalDispose(this._cityData.cityId, curData.id, this._data.order, Number(position), this._cityData);
    }

    protected updateView(): void {
        let comp: CityGeneralItemLogic = null;
        let generalData: GeneralData = null;
        let generalCfg: GeneralConfig = null;
        let isUnlock: boolean = false;
        let totalCost: number = 0;
        let soldierCnt: number = 0;
        let totalSoldierCnt: number = 0;
        this.clearSoldiers();
        if (this._isUnlock) {
            for (let i: number = 0; i < this._gengeralLogics.length; i++) {
                comp = this._gengeralLogics[i];
                generalData = null;
                isUnlock = true;
                if (i == 2) {
                    //只有第二个副将才需要判断是否解锁
                    isUnlock = this._condition.vanguardCnt >= this._order;
                }
                if (this._data && this._data.generals[i] > 0) {
                    generalData = GeneralCommand.getInstance().proxy.getMyGeneral(this._data.generals[i]);
                    generalCfg = GeneralCommand.getInstance().proxy.getGeneralCfg(generalData.cfgId);
                    totalCost += generalCfg.cost;
                    this._soldiers[i] = this._data.soldiers[i];
                    this._totalSoldiers[i] = generalData.level * 100 + this._condition.soldierCnt;
                    soldierCnt += this._soldiers[i];
                    totalSoldierCnt += this._totalSoldiers[i];
                }
                if (isUnlock == false || generalData == null) {
                    this.tipNodes[i].active = true;
                    this.editBoxs[i].node.active = false;
                    this.sliders[i].node.active = false;
                } else {
                    this.tipNodes[i].active = false;
                    this.editBoxs[i].node.active = true;
                    this.sliders[i].node.active = true;

                    let totalValue: number = this._totalSoldiers[i] - this._soldiers[i];
                    if (this._data && this._data.cmd > 0 || totalValue <= 0) {
                        //不可征兵
                        this.editBoxs[i].string = "0";
                        this.sliders[i].progress = 0;
                        this.editBoxs[i].enabled = false;
                        this.sliders[i].enabled = false;
                    } else {
                        this.editBoxs[i].enabled = true;
                        this.sliders[i].enabled = true;
                        let curValue: number = 0;
                        if (this.editBoxs[i].string != "") {
                            curValue = Math.max(0, Math.min(parseInt(this.editBoxs[i].string), totalValue));
                        }
                        this.setCurConscriptForIndex(i, curValue);
                    }

                }
                comp.setData(this._cityId, this._order, generalData, this._soldiers[i], this._totalSoldiers[i], isUnlock);
                console.log("compcmpaksdf", comp);
            }
        }
        this.labelId.string = "部队" + this._order;
        this.labelCost.string = totalCost + "/" + this._cityData.cost;
        this.labelSoldierCnt.string = soldierCnt + "/" + totalSoldierCnt;
    }

    protected setCurConscriptForIndex(index: number, cnt: number = 0): void {
        let maxCnt: number = this._totalSoldiers[index] - this._soldiers[index];
        cnt = Math.min(cnt, maxCnt);
        let percent: number = cnt / maxCnt;
        this.editBoxs[index].string = cnt + "";
        this.sliders[index].progress = percent;
        this._curConscripts[index] = cnt;
    }

    protected getTotalConscriptCnt(): number {
        let totalCnt: number = 0;
        for (let i = 0; i < this._curConscripts.length; i++) {
            totalCnt += this._curConscripts[i];
        }
        return totalCnt;
    }

    protected updateResCost(): void {
        let totalCnt: number = this.getTotalConscriptCnt();
        if (totalCnt > 0) {
            var myRoleRes = LoginCommand.getInstance().proxy.getRoleResData();
            var baseCost: ConscriptBaseCost = MapUICommand.getInstance().proxy.getBaseCost();
            let str: string = "消耗:  " + "金币:" + totalCnt * baseCost.cost_gold + "/" + myRoleRes.gold;
            str += " 木材:" + totalCnt * baseCost.cost_wood + "/" + myRoleRes.wood;
            str += " 金属:" + totalCnt * baseCost.cost_iron + "/" + myRoleRes.iron;
            str += " 谷物:" + totalCnt * baseCost.cost_grain + "/" + myRoleRes.grain;
            this.labelResCost.string = str;
        } else {
            this.labelResCost.string = "";
        }
    }

    protected onChangeEditBox(editBox: cc.EditBox): void {
        let index: number = this.editBoxs.indexOf(editBox);
        if (index >= 0) {
            this.setCurConscriptForIndex(index, parseInt(this.editBoxs[index].string));
            this.updateResCost();
        }
    }

    protected onChangeSlider(slider: cc.Slider): void {
        let index: number = this.sliders.indexOf(slider);
        if (index >= 0) {
            let maxCnt: number = this._totalSoldiers[index] - this._soldiers[index];
            this.setCurConscriptForIndex(index, Math.floor(this.sliders[index].progress * maxCnt));
            this.updateResCost();
        }
    }

    protected onClickQuick(): void {
        for (let i: number = 0; i < this._totalSoldiers.length; i++) {
            let maxCnt: number = this._totalSoldiers[i] - this._soldiers[i];
            if (maxCnt > 0) {
                this.setCurConscriptForIndex(i, maxCnt);
            }
        }
        this.updateResCost();
    }

    protected onClickSure(): void {
        let totalCnt: number = this.getTotalConscriptCnt();
        if (totalCnt > 0) {
            ArmyCommand.getInstance().generalConscript(this._data.id, this._curConscripts, null);
        }
    }

    protected onClickPrev(): void {
        this._curConscripts = [0, 0, 0];
        if (this._order == 1) {
            //第一个就跳到最后一个
            this.setData(this._cityId, this._condition.armyCnt);
        } else {
            this.setData(this._cityId, this._order - 1);
        }
    }

    protected onClickNext(): void {
        this._curConscripts = [0, 0, 0];
        if (this._order == this._condition.armyCnt) {
            //最后一个就跳到第一个
            this.setData(this._cityId, 1);
        } else {
            this.setData(this._cityId, this._order + 1);
        }
    }

    protected onClickClose(): void {
        this.node.active = false;
    }

    public setData(cityId: number, order: number = 1): void {
        console.log("setData", arguments)
        this._cityId = cityId;
        this._order = order;
        this._cityData = MapCommand.getInstance().cityProxy.getMyCityById(this._cityId);
        this._data = ArmyCommand.getInstance().proxy.getArmyByOrder(order, cityId);
        this._condition = MapUICommand.getInstance().proxy.getMyCityAddition(cityId);
        this._isUnlock = this._condition.armyCnt >= this._order;
        console.log("_cityData", this._cityData, this._data, this._condition);
        this.updateView();
    }
}