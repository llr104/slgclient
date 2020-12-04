import ArmyCommand from "../../general/ArmyCommand";
import { ArmyData } from "../../general/ArmyProxy";
import GeneralCommand from "../../general/GeneralCommand";
import { GeneralConfig, GeneralData } from "../../general/GeneralProxy";
import MapUICommand from "./MapUICommand";

const { ccclass, property } = cc._decorator;

@ccclass
export default class CityGeneralItemLogic extends cc.Component {
    @property(cc.Node)
    infoNode: cc.Node = null;
    @property(cc.Node)
    addNode: cc.Node = null;
    @property(cc.Node)
    lockNode: cc.Node = null;
    @property(cc.Node)
    btnDown: cc.Node = null;
    @property(cc.Label)
    labelTitle: cc.Label = null;
    @property(cc.Sprite)
    headIcon: cc.Sprite = null;
    @property(cc.Label)
    labelLv: cc.Label = null;
    @property(cc.Label)
    labelName: cc.Label = null;
    @property(cc.Label)
    labelArms: cc.Label = null;
    @property(cc.Label)
    labelSoldierCnt: cc.Label = null;
    @property(cc.Label)
    labelCost: cc.Label = null;
    @property(cc.Label)
    labelTip: cc.Label = null;
    @property(cc.ProgressBar)
    progressBar: cc.ProgressBar = null;


    public index: number = 0;
    protected _order: number = 0;
    protected _cityId: number = 0;
    protected _data: GeneralData = null;
    protected _soldierCnt: number = 0;
    protected _totalSoldierCnt: number = 0;
    protected _isUnlock: boolean = false;

    protected onLoad(): void {

    }

    protected onDestroy(): void {
        this._data = null;
    }

    protected onClickDown(): void {
        ArmyCommand.getInstance().generalDispose(this._cityId, this._data.id, this._data.order, -1, null);
    }

    protected onClickItem(): void {
        if (this._data) {
            //点击展示武将信息
            let cfg: GeneralConfig = GeneralCommand.getInstance().proxy.getGeneralCfg(this._data.cfgId);
            cc.systemEvent.emit("open_general_des", cfg, this._data);
        } else if (this.addNode.active) {
            //上阵武将
            var generalArr: number[] = this.getAllGenerals();
            cc.systemEvent.emit("open_general_choose", generalArr, this.index);
        }
    }

    protected getAllGenerals(): number[] {
        let cityArmyData: ArmyData[] = ArmyCommand.getInstance().proxy.getArmyList(this._cityId);
        let general: GeneralData = null;
        var arr = [];
        for (var i = 0; i < cityArmyData.length; i++) {
            if (cityArmyData[i]) {
                arr = arr.concat(cityArmyData[i].generals);
                for (let j: number = 0; j < cityArmyData[i].generals.length; j++) {
                    if (cityArmyData[i].generals[j] > 0) {
                        general = GeneralCommand.getInstance().proxy.getMyGeneral(cityArmyData[i].generals[i]);
                        if (general) {
                            arr = arr.concat(GeneralCommand.getInstance().proxy.getGeneralIds(general.cfgId));
                        }
                    }
                }
            }
        }
        return arr;
    }

    protected updateItem(): void {
        if (this.index == 0) {
            this.labelTitle.string = "主将"
        } else {
            this.labelTitle.string = "副将"
        }
        if (this._isUnlock == false) {
            //未解锁
            this.infoNode.active = false;
            this.addNode.active = false;
            this.lockNode.active = true;
            this.btnDown.active = false;
            let desName: string = MapUICommand.getInstance().proxy.getFacilityCfgByType(14).name;
            this.labelTip.string = desName + " 等级" + this._order + "开启";
        } else if (this._data == null) {
            //未配置武将
            this.infoNode.active = false;
            this.addNode.active = true;
            this.lockNode.active = false;
            this.btnDown.active = false;
        } else {
            //展示武将信息
            this.infoNode.active = true;
            this.addNode.active = false;
            this.lockNode.active = false;
            this.btnDown.active = true;

            let cfg: GeneralConfig = GeneralCommand.getInstance().proxy.getGeneralCfg(this._data.cfgId);
            this.headIcon.spriteFrame = GeneralCommand.getInstance().proxy.getGeneralTex(this._data.cfgId);
            this.labelLv.string = this._data.level + "";
            this.labelName.string = cfg.name;
            this.labelSoldierCnt.string = this._soldierCnt + "/" + this._totalSoldierCnt;
            this.progressBar.progress = this._soldierCnt / this._totalSoldierCnt;
            this.labelCost.string = "Cost " + cfg.cost;
        }
        console.log("updateItem", this._data, this.index);
    }

    public setData(cityId: number, order: number, data: GeneralData, soldierCnt: number, totalSoldierCnt: number, isUnlock: boolean): void {
        this._cityId = cityId;
        this._order = order;
        this._data = data;
        this._soldierCnt = soldierCnt;
        this._totalSoldierCnt = totalSoldierCnt;
        this._isUnlock = isUnlock;
        this.updateItem();
    }
}