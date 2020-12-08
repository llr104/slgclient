import { ArmyCmd, ArmyData } from "../../general/ArmyProxy";
import GeneralCommand from "../../general/GeneralCommand";
import ArmyCommand from "../../general/ArmyCommand";
import { GeneralConfig, GeneralData } from "../../general/GeneralProxy";
import MapUICommand from "./MapUICommand";

const { ccclass, property } = cc._decorator;

@ccclass
export default class CityArmyItemLogic extends cc.Component {
    @property(cc.Node)
    infoNode: cc.Node = null;
    @property(cc.Node)
    maskNode: cc.Node = null;
    @property(cc.Node)
    tipNode: cc.Node = null;
    @property(cc.Label)
    labelTip: cc.Label = null;
    @property(cc.Sprite)
    headIcon: cc.Sprite = null;
    @property(cc.Label)
    labelId: cc.Label = null;
    @property(cc.Label)
    labelState: cc.Label = null;
    @property(cc.Label)
    labelLv: cc.Label = null;
    @property(cc.Label)
    labelName: cc.Label = null;
    @property(cc.Label)
    labelArms: cc.Label = null;
    @property(cc.Label)
    labelSoldierCnt: cc.Label = null;
    @property(cc.Label)
    labelVice1: cc.Label = null;
    @property(cc.Label)
    labelVice2: cc.Label = null;

    public order: number = 0;
    protected _cityId: number = 0;
    protected _data: ArmyData = null;
    protected _isOpened: boolean = true;

    protected onLoad(): void {
        cc.systemEvent.on("update_army", this.onUpdateArmy, this);
        this.tipNode.active = false;
    }

    protected onDestroy(): void {
        cc.systemEvent.targetOff(this);
        this._data = null;
    }

    protected onUpdateArmy(armyData: ArmyData): void {
        if (this._data && armyData.id == this._data.id) {
            this.setArmyData(this._cityId, armyData);
        }
    }

    protected onClickItem(): void {
        if (this.maskNode.active == false) {
                cc.systemEvent.emit("open_army_setting", this._cityId, this.order);
        } else {

        }
    }

    protected updateItem(): void {
        if (this._data && this._data.generals[0] != 0) {
            //有数据 并且配置了第一个将
            this.tipNode.active = false;
            this.infoNode.active = true;
            let generals: GeneralData[] = ArmyCommand.getInstance().getArmyGenerals(this._data);
            let firstGeneralCfg: GeneralConfig = GeneralCommand.getInstance().proxy.getGeneralCfg(generals[0].cfgId);
            let curSoldierCnt: number = ArmyCommand.getInstance().getArmyCurSoldierCnt(this._data);
            let totalSoldierCnt: number = ArmyCommand.getInstance().getArmyTotalSoldierCntByGenerals(generals);
            if (this._data.cmd == ArmyCmd.Reclaim) {
                //屯田中
                this.labelState.string = "屯田中...";
            } else if (this._data.cmd > 0) {
                this.labelState.string = "队伍外派中...";
            } else {
                this.labelState.string = "";
            }
            this.labelId.string = this.order + "";
            this.headIcon.spriteFrame = GeneralCommand.getInstance().proxy.getGeneralTex(generals[0].cfgId);
            this.labelLv.string = generals[0].level + "";
            this.labelName.string = firstGeneralCfg.name;
            this.labelSoldierCnt.string = curSoldierCnt + "/" + totalSoldierCnt;
            // this.labelArms.string = "";

            if (generals[1]) {
                let sencondGeneralCfg: GeneralConfig = GeneralCommand.getInstance().proxy.getGeneralCfg(generals[1].cfgId);
                this.labelVice1.string = sencondGeneralCfg.name;
            } else {
                this.labelVice1.string = "无";
            }

            if (generals[2]) {
                let thirdGeneralCfg: GeneralConfig = GeneralCommand.getInstance().proxy.getGeneralCfg(generals[2].cfgId);
                this.labelVice2.string = thirdGeneralCfg.name;
            } else {
                this.labelVice2.string = "无";
            }
        } else {
            this.tipNode.active = true;
            this.infoNode.active = false;
            this.labelTip.string = "点击编制队伍";
        }
    }

    public isOpenedArmy(bool: boolean): void {
        this._isOpened = bool;
        this.infoNode.active = this._isOpened;
        this.maskNode.active = !this._isOpened;
        this.tipNode.active = !this._isOpened;
        if (this._isOpened == false) {
            let desName: string = MapUICommand.getInstance().proxy.getFacilityCfgByType(13).name;
            this.labelTip.string = desName + " 等级" + this.order + "开启";
        }
    }

    public setArmyData(cityId: number, data: ArmyData): void {
        this._cityId = cityId;
        this._data = data;
        this.updateItem();
    }
}