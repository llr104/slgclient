import { _decorator, Component, Node, Label, Sprite } from 'cc';
const { ccclass, property } = _decorator;

import { ArmyCmd, ArmyData } from "../../general/ArmyProxy";
import GeneralCommand from "../../general/GeneralCommand";
import ArmyCommand from "../../general/ArmyCommand";
import { GeneralConfig, GeneralData } from "../../general/GeneralProxy";
import MapUICommand from "./MapUICommand";
import GeneralHeadLogic from "./GeneralHeadLogic";
import { EventMgr } from '../../utils/EventMgr';

@ccclass('CityArmyItemLogic')
export default class CityArmyItemLogic extends Component {
    @property(Node)
    infoNode: Node = null;
    @property(Node)
    maskNode: Node = null;
    @property(Node)
    tipNode: Node = null;
    @property(Label)
    labelTip: Label = null;
    @property(Sprite)
    headIcon: Sprite = null;
    @property(Label)
    labelId: Label = null;
    @property(Label)
    labelState: Label = null;
    @property(Label)
    labelLv: Label = null;
    @property(Label)
    labelName: Label = null;
    @property(Label)
    labelArms: Label = null;
    @property(Label)
    labelSoldierCnt: Label = null;
    @property(Label)
    labelVice1: Label = null;
    @property(Label)
    labelVice2: Label = null;

    public order: number = 0;
    protected _cityId: number = 0;
    protected _data: ArmyData = null;
    protected _isOpened: boolean = true;
    protected _isOut: boolean = true;

    protected onLoad(): void {
        EventMgr.on("update_army", this.onUpdateArmy, this);
        this.tipNode.active = false;
    }

    protected onDestroy(): void {
        EventMgr.targetOff(this);
        this._data = null;
    }

    protected onUpdateArmy(armyData: ArmyData): void {
        if (this._data && armyData.id == this._data.id) {
            this.setArmyData(this._cityId, armyData);
        }
    }

    protected onClickItem(): void {
        if (this.maskNode.active == false) {
            if(this._isOut){
                if(this._data){
                    EventMgr.emit("open_army_setting", this._cityId, this._data.order);
                }
            }else{
                EventMgr.emit("open_army_setting", this._cityId, this.order);
            }
        }
    }

    protected updateItem(): void {
     
        console.log("cityarmyitem:", this._data);
        
        if(this._isOpened == false){
            return
        }

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
            } else if(this._data.cmd == ArmyCmd.Conscript){
                this.labelState.string = "征兵中...";
            } else if (this._data.cmd > 0) {
                this.labelState.string = "队伍外派中...";
            } else {
                this.labelState.string = "";
            }
            this.labelId.string = this.order + "";
            this.headIcon.getComponent(GeneralHeadLogic).setHeadId(generals[0].cfgId);
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
            if(this._isOut){
                this.tipNode.active = true;
                this.infoNode.active = false;
                this.labelTip.string = "暂无队伍";
            }else{
                this.tipNode.active = true;
                this.infoNode.active = false;
                this.labelTip.string = "点击编制队伍";
            }
        }
    }

    public isOpenedArmy(bool: boolean, isOut: boolean): void {
        this._isOpened = bool;
        this.infoNode.active = false;
        this.maskNode.active = !this._isOpened;
        this.tipNode.active = !this._isOpened;
        this._isOut = isOut;
        if (this._isOpened == false) {
            if (this._isOut){
                this.labelTip.string = " 等级" + this.order + "开启";
            }else{
                let desName: string = MapUICommand.getInstance().proxy.getFacilityCfgByType(13).name;
                this.labelTip.string = desName + " 等级" + this.order + "开启";
            }
        }
    }

    public setArmyData(cityId: number, data: ArmyData): void {
        this._cityId = cityId;
        this._data = data;
        this.updateItem();
    }
}
