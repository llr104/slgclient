import { _decorator, Component, Node, Label, Sprite, ProgressBar } from 'cc';
const { ccclass, property } = _decorator;

import ArmyCommand from "../../general/ArmyCommand";
import { ArmyData } from "../../general/ArmyProxy";
import GeneralCommand from "../../general/GeneralCommand";
import { GeneralCampType, GeneralConfig, GeneralData } from "../../general/GeneralProxy";
import DateUtil from "../../utils/DateUtil";
import GeneralHeadLogic from "./GeneralHeadLogic";
import MapUICommand from "./MapUICommand";
import { EventMgr } from '../../utils/EventMgr';

@ccclass('CityGeneralItemLogic')
export default class CityGeneralItemLogic extends Component {
    @property(Node)
    infoNode: Node = null;
    @property(Node)
    addNode: Node = null;
    @property(Node)
    lockNode: Node = null;
    @property(Node)
    btnDown: Node = null;
    @property(Label)
    labelTitle: Label = null;
    @property(Sprite)
    headIcon: Sprite = null;
    @property(Label)
    labelLv: Label = null;
    @property(Label)
    labelName: Label = null;
    @property(Label)
    labelArms: Label = null;
    @property(Label)
    labelSoldierCnt: Label = null;
    @property(Label)
    labelCost: Label = null;
    @property(Label)
    labelCamp: Label = null;
    @property(Label)
    labelTip: Label = null;
    @property(Label)
    labelConTime: Label = null;
    @property(Label)
    labelConCnt: Label = null;
    @property(ProgressBar)
    progressBar: ProgressBar = null;
    @property(Node)
    conBg: Node = null;

    public index: number = 0;
    protected _order: number = 0;
    protected _cityId: number = 0;
    protected _data: GeneralData = null;
    protected _soldierCnt: number = 0;
    protected _totalSoldierCnt: number = 0;
    protected _conCnt: number = 0;
    protected _conTime: number = 0;
    protected _isUnlock: boolean = false;

    protected onLoad(): void {
        this.schedule(this.updateCon, 1.0);
    }

    protected onEnable(): void{
        this.conBg.active = false;
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
            EventMgr.emit("open_general_des", cfg, this._data);
        } else if (this.addNode.active) {
            //上阵武将
            var generalArr: number[] = this.getAllGenerals();
            EventMgr.emit("open_general_choose", generalArr, this.index);
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
                        general = GeneralCommand.getInstance().proxy.getMyGeneral(cityArmyData[i].generals[j]);
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
            this.conBg.active = false;
        } else if (this._data == null) {
            //未配置武将
            this.infoNode.active = false;
            this.addNode.active = true;
            this.lockNode.active = false;
            this.btnDown.active = false;
            this.conBg.active = false;
            
        } else {
            //展示武将信息
            this.infoNode.active = true;
            this.addNode.active = false;
            this.lockNode.active = false;
            this.btnDown.active = true;
            
            this.updateCon();

            let cfg: GeneralConfig = GeneralCommand.getInstance().proxy.getGeneralCfg(this._data.cfgId);
            this.headIcon.getComponent(GeneralHeadLogic).setHeadId(this._data.cfgId);
            this.labelLv.string = this._data.level + "";
            this.labelName.string = cfg.name;
            this.labelSoldierCnt.string = this._soldierCnt + "/" + this._totalSoldierCnt;
            this.progressBar.progress = this._soldierCnt / this._totalSoldierCnt;
            this.labelCost.string = "Cost " + cfg.cost;
            switch (this._data.config.camp) {
                case GeneralCampType.Han:
                    this.labelCamp.string = "汉";
                    break;
                case GeneralCampType.Qun:
                    this.labelCamp.string = "群";
                    break;
                case GeneralCampType.Wei:
                    this.labelCamp.string = "魏";
                    break;
                case GeneralCampType.Shu:
                    this.labelCamp.string = "蜀";
                    break;
                case GeneralCampType.Wu:
                    this.labelCamp.string = "吴";
                    break;
                default:
                    this.labelCamp.string = "无";
                    break;
            }

        }
    }

    protected updateCon(){
        if (DateUtil.isAfterServerTime(this._conTime*1000)){
            this.conBg.active = false;
            this.labelConTime.string = "";
            this.labelConCnt.string = "";
        }else{
            this.conBg.active = true;
            this.labelConTime.string = DateUtil.leftTimeStr(this._conTime*1000);
            this.labelConCnt.string = "+" + this._conCnt;
        }
    }
 
    public setData(cityId: number, order: number, data: GeneralData, 
        soldierCnt: number, totalSoldierCnt: number, conCnt:number, 
        conTime:number, isUnlock: boolean): void {
        this._cityId = cityId;
        this._order = order;
        this._data = data;
        this._soldierCnt = soldierCnt;
        this._totalSoldierCnt = totalSoldierCnt;
        this._conCnt = conCnt;
        this._conTime = conTime;
        this._isUnlock = isUnlock;
        this.updateItem();
    }
}
