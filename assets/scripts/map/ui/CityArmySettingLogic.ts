import { _decorator, Component, Label, Node, Prefab, EditBox, Slider, instantiate } from 'cc';
const { ccclass, property } = _decorator;

import { ArmyCmd, ArmyData } from "../../general/ArmyProxy";
import GeneralCommand from "../../general/GeneralCommand";
import ArmyCommand from "../../general/ArmyCommand";
import { GeneralCampType, GeneralConfig, GeneralData } from "../../general/GeneralProxy";
import MapUICommand from "./MapUICommand";
import MapCommand from "../MapCommand";
import { MapCityData } from "../MapCityProxy";
import { CityAddition, CityAdditionType, Facility } from "./MapUIProxy";
import CityGeneralItemLogic from "./CityGeneralItemLogic";
import LoginCommand from "../../login/LoginCommand";
import { Conscript } from "../../config/Basci";
import { EventMgr } from '../../utils/EventMgr';

@ccclass('CityArmySettingLogic')
export default class CityArmySettingLogic extends Component {
    @property(Label)
    labelId: Label = null;
    @property(Label)
    labelCost: Label = null;
    @property(Label)
    labelSoldierCnt: Label = null;
    @property(Label)
    labelSpeed: Label = null;
    @property(Label)
    labelAtkCity: Label = null;
    @property(Label)
    labelAddition: Label = null;
    @property(Label)
    labelAdditionTip: Label = null;
    @property(Node)
    additionTouchNode: Node = null;
    @property(Node)
    additionTipNode: Node = null;
    @property(Label)
    labelResCost: Label = null;
    @property(Node)
    generalLayer: Node = null;
    @property(Prefab)
    generalPrefab: Prefab = null;
    @property([EditBox])
    editBoxs: EditBox[] = [];
    @property([Slider])
    sliders: Slider[] = [];
    @property([Node])
    tipNodes: Node[] = [];

    protected _generalCnt: number = 3;
    protected _order: number = 0;
    protected _cityId: number = 0;
    protected _cityData: MapCityData = null;
    protected _isUnlock: boolean = false;
    protected _data: ArmyData = null;
    protected _addition: CityAddition = null;
    protected _gengeralLogics: CityGeneralItemLogic[] = [];
    protected _soldiers: number[] = null;
    protected _totalSoldiers: number[] = null;
    protected _curConscripts: number[] = null;//当前征兵数

    protected _conTimes: number[] = null;
    protected _conCnts: number[] = null;

    protected onLoad(): void {
        this.initView();
        this.additionTipNode.active = false;
        this.additionTouchNode.on(Node.EventType.TOUCH_START, this.onShowAdditionTip, this);
        this.additionTouchNode.on(Node.EventType.TOUCH_END, this.onHideAdditionTip, this);
        this.additionTouchNode.on(Node.EventType.TOUCH_CANCEL, this.onHideAdditionTip, this);
    }

    protected onDestroy(): void {
        this._gengeralLogics.length = 0;
    }

    protected onEnable(): void {
        this._soldiers = [0, 0, 0];
        this._totalSoldiers = [0, 0, 0];
        this._curConscripts = [0, 0, 0];
        this._conTimes = [0, 0, 0];
        this._conCnts = [0, 0, 0];

        EventMgr.on("update_army", this.onUpdateArmy, this);
        EventMgr.on("chosed_general", this.onChooseGeneral, this);
        EventMgr.on("update_city_addition", this.onUpdateAddition, this);
    }

    protected onDisable(): void {
        EventMgr.targetOff(this);
        this._data = null;
        this._addition = null;
        this._cityData = null;
    }

    protected initView(): void {
        for (let i: number = 0; i < this._generalCnt; i++) {
            let item: Node = instantiate(this.generalPrefab);
            item.parent = this.generalLayer;
            let comp: CityGeneralItemLogic = item.getComponent(CityGeneralItemLogic);
            comp.index = i;
            this._gengeralLogics.push(comp);
        }
    }

    protected onShowAdditionTip(): void {
        if (this._data && this.labelAddition.string != "无") {
            this.additionTipNode.active = true;
        }
    }

    protected onHideAdditionTip(): void {
        this.additionTipNode.active = false;
    }

    protected clearSoldiers(): void {
        for (let i: number = 0; i < this._generalCnt; i++) {
            this._soldiers[i] = 0;
            this._totalSoldiers[i] = 0;
        }
    }

    protected onUpdateArmy(armyData: ArmyData): void {
        if (armyData.cityId == this._cityId && armyData.order == this._order) {
            this.setData(this._cityId, this._order);
        }
    }

    protected onUpdateAddition(cityId: number): void {
        if (this._cityId == cityId) {
            this.setData(this._cityId, this._order);
        }
    }

    protected onChooseGeneral(cfgData: any, curData: any, position: any): void {
        ArmyCommand.getInstance().generalDispose(this._cityData.cityId, curData.id, this._order, Number(position), this._cityData);
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
                    isUnlock = this._addition.vanguardCnt >= this._order;
                }
                if (this._data && this._data.generals[i] > 0) {
                    generalData = GeneralCommand.getInstance().proxy.getMyGeneral(this._data.generals[i]);
                    generalCfg = GeneralCommand.getInstance().proxy.getGeneralCfg(generalData.cfgId);
                    totalCost += generalCfg.cost;
                    this._soldiers[i] = this._data.soldiers[i];
                    this._totalSoldiers[i] = generalData.level * 100 + this._addition.soldierCnt;
                    soldierCnt += this._soldiers[i];
                    totalSoldierCnt += this._totalSoldiers[i];
                    this._conTimes[i] = this._data.conTimes[i];
                    this._conCnts[i] = this._data.conCnts[i];

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
                    if(this._data && this._data.cmd == ArmyCmd.Conscript){
                        var can = this._conCnts[i] == 0
                        this.sliders[i].enabled = can;
                        this.editBoxs[i].string = "0";
                        this.sliders[i].progress = 0;
                        this.editBoxs[i].enabled = can;
                    }else if(this._data && this._data.cmd > ArmyCmd.Idle || totalValue <= 0) {
                        //不可征兵
                        this.editBoxs[i].string = "0";
                        this.sliders[i].progress = 0;
                        this.editBoxs[i].enabled = false;
                        this.sliders[i].enabled = false;
                        this.setCurConscriptForIndex(i, 0);
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
                comp.setData(this._cityId, this._order, generalData, this._soldiers[i], this._totalSoldiers[i], this._conCnts[i], this._conTimes[i], isUnlock);
            }
        }
        this.labelId.string = "部队" + this._order;
        this.labelCost.string = totalCost + "/" + MapUICommand.getInstance().proxy.getMyCityCost(this._cityId);
        this.labelSoldierCnt.string = soldierCnt + "/" + totalSoldierCnt;
        this.labelAddition.string = "无";
        if (this._data) {
            let generals: GeneralData[] = ArmyCommand.getInstance().getArmyGenerals(this._data);
            let speed: number = ArmyCommand.getInstance().getArmySpeed(generals);
            this.labelSpeed.string = speed.toFixed(2);

            let destroy: number = ArmyCommand.getInstance().getArmyDestroy(generals);
            this.labelAtkCity.string = destroy.toFixed(2);

            let camp: number = ArmyCommand.getInstance().getArmyCamp(generals);
            if (camp > 0) {
                if (camp == GeneralCampType.Han && this._addition.han > 0) {
                    this.labelAdditionTip.string = "汉阵营加成：" + this._addition.han;
                    this.labelAddition.string = "阵营";
                } else if (camp == GeneralCampType.Qun && this._addition.han > 0) {
                    this.labelAdditionTip.string = "群阵营加成：" + this._addition.qun;
                    this.labelAddition.string = "阵营";
                } else if (camp == GeneralCampType.Wei && this._addition.han > 0) {
                    this.labelAdditionTip.string = "魏阵营加成：" + this._addition.wei;
                    this.labelAddition.string = "阵营";
                } else if (camp == GeneralCampType.Shu && this._addition.han > 0) {
                    this.labelAdditionTip.string = "蜀阵营加成：" + this._addition.shu;
                    this.labelAddition.string = "阵营";
                } else if (camp == GeneralCampType.Wu && this._addition.han > 0) {
                    this.labelAdditionTip.string = "吴阵营加成：" + this._addition.wu;
                    this.labelAddition.string = "阵营";
                }
            }
        } else {
            this.labelSpeed.string = "0";
        }

        this.updateResCost();
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
            var baseCost: Conscript = MapUICommand.getInstance().proxy.getConscriptBaseCost();
            let str: string = "消耗:  " + "金币:" + totalCnt * baseCost.cost_gold + "/" + myRoleRes.gold;
            str += " 木材:" + totalCnt * baseCost.cost_wood + "/" + myRoleRes.wood;
            str += " 金属:" + totalCnt * baseCost.cost_iron + "/" + myRoleRes.iron;
            str += " 谷物:" + totalCnt * baseCost.cost_grain + "/" + myRoleRes.grain;
            this.labelResCost.string = str;
        } else {
            this.labelResCost.string = "";
        }
    }

    protected onChangeEditBox(editBox: EditBox): void {
        let index: number = this.editBoxs.indexOf(editBox);
        if (index >= 0) {
            this.setCurConscriptForIndex(index, parseInt(this.editBoxs[index].string));
            this.updateResCost();
        }
    }

    protected onChangeSlider(slider: Slider): void {
        let index: number = this.sliders.indexOf(slider);
        if (index >= 0) {
            let maxCnt: number = this._totalSoldiers[index] - this._soldiers[index];
            this.setCurConscriptForIndex(index, Math.floor(this.sliders[index].progress * maxCnt));
            this.updateResCost();
        }
    }

    protected onClickQuick(): void {
        if (this._data && this._data.cmd == ArmyCmd.Idle || this._data.cmd == ArmyCmd.Conscript) {
            for (let i: number = 0; i < this._totalSoldiers.length; i++) {
                if(this._conCnts[i] > 0){
                    //正在征兵的不能重复征兵
                    this.setCurConscriptForIndex(i, 0);
                }else{
                    let maxCnt: number = this._totalSoldiers[i] - this._soldiers[i];
                    if (maxCnt > 0) {
                        this.setCurConscriptForIndex(i, maxCnt);
                    }
                }
            }
            this.updateResCost();
        }

    }

    protected onClickSure(): void {
        if (this._data && this._data.cmd == ArmyCmd.Idle || this._data.cmd == ArmyCmd.Conscript) {
            let totalCnt: number = this.getTotalConscriptCnt();
            if (totalCnt > 0) {
                ArmyCommand.getInstance().generalConscript(this._data.id, this._curConscripts, null);
            }
        }
    }

    protected onClickPrev(): void {
        this._curConscripts = [0, 0, 0];
        if (this._order == 1) {
            //第一个就跳到最后一个
            this.setData(this._cityId, this._addition.armyCnt);
        } else {
            this.setData(this._cityId, this._order - 1);
        }
    }

    protected onClickNext(): void {
        this._curConscripts = [0, 0, 0];
        if (this._order == this._addition.armyCnt) {
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
        this._curConscripts = [0, 0, 0];
        this._cityId = cityId;
        this._order = order;
        this._cityData = MapCommand.getInstance().cityProxy.getMyCityById(this._cityId);
        this._data = ArmyCommand.getInstance().proxy.getArmyByOrder(order, cityId);
        this._addition = MapUICommand.getInstance().proxy.getMyCityAddition(cityId);
        this._isUnlock = this._addition.armyCnt >= this._order;
        let facility: Map<number, Facility> = MapUICommand.getInstance().proxy.getMyFacilitys(this._cityId);
        if (facility == null) {
            MapUICommand.getInstance().qryCityFacilities(this._cityId);
        }
        this.updateView();
    }
}
