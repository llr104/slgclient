import { _decorator, Component, Label, Node, Sprite, UITransform } from 'cc';
const { ccclass, property } = _decorator;

import { ArmyCmd, ArmyData } from "../../general/ArmyProxy";
import GeneralCommand from "../../general/GeneralCommand";
import ArmyCommand from "../../general/ArmyCommand";
import { GeneralConfig, GeneralData } from "../../general/GeneralProxy";
import { MapCityData } from "../MapCityProxy";
import MapCommand from "../MapCommand";
import DateUtil from "../../utils/DateUtil";
import GeneralHeadLogic from "./GeneralHeadLogic";
import { EventMgr } from '../../utils/EventMgr';

@ccclass('RightArmyItemLogic')
export default class RightArmyItemLogic extends Component {
    @property(Label)
    labelInfo: Label = null;
    @property(Label)
    labelPos: Label = null;
    @property(Node)
    bottomNode: Node = null;
    @property(Sprite)
    headIcon: Sprite = null;
    @property(Label)
    labelSoldierCnt: Label = null;
    @property(Label)
    labelStrength: Label = null;
    @property(Label)
    labelMorale: Label = null;
    @property(Node)
    btnBack: Node = null;
    @property(Node)
    btnSetting: Node = null;

    public order: number = 0;
    protected _data: ArmyData = null;
    protected _firstGeneral: GeneralData = null;
    protected _qryReturnTime: number = 0;

    protected onLoad(): void {
        EventMgr.on("update_general", this.onUpdateGeneral, this);
        this.node.getComponent(UITransform).height -= this.bottomNode.getComponent(UITransform).height;
        this.bottomNode.active = false;
    }

    protected onDestroy(): void {
        EventMgr.targetOff(this);
        this._data = null;
    }

    protected update(): void {
        if (this._data && (this._data.state > 0 || this._data.cmd == ArmyCmd.Reclaim)) {
            let nowTime: number = DateUtil.getServerTime();
            let time: number = 0;
            if (this._data.state > 0) {
                //行军或者撤退中
                time = Math.max(0, this._data.endTime - nowTime);
            } else {
                //屯田中
                time = Math.max(0, GeneralCommand.getInstance().proxy.getCommonCfg().reclamation_time * 1000 - (nowTime - this._data.endTime));
                // if (time == 0 && nowTime - this._qryReturnTime > 2000) {
                //     //屯田结束 主动请求撤退
                //     this._qryReturnTime = nowTime;
                //     this.onClickBack();
                // }
            }
            this.labelPos.string = DateUtil.converSecondStr(time);
        }
    }

    protected onUpdateGeneral(): void {

    }

    protected onClickTop(): void {
        this.bottomNode.active = !this.bottomNode.active;
        if(this.bottomNode.active){
            this.node.getComponent(UITransform).height += this.bottomNode.getComponent(UITransform).height;
        }else{
            this.node.getComponent(UITransform).height -= this.bottomNode.getComponent(UITransform).height;
        }
    }

    protected onClickBack(): void {
        if (this._data) {
            let cityData: MapCityData = MapCommand.getInstance().cityProxy.getMyMainCity();
            ArmyCommand.getInstance().generalAssignArmy(this._data.id, ArmyCmd.Return, cityData.x, cityData.y, null);
        }
    }

    protected onClickSetting(): void {
        if (this._data) {
            let cityData: MapCityData = MapCommand.getInstance().cityProxy.getMyCityById(this._data.cityId);
            EventMgr.emit("open_army_setting", this._data.cityId, this.order);
        }
    }

    protected updateGeneralByData(): void {
        let stateStr: string = ArmyCommand.getInstance().getArmyStateDes(this._data);
        var teamName = "";
        if (this._firstGeneral) {
            let cfg: GeneralConfig = GeneralCommand.getInstance().proxy.getGeneralCfg(this._firstGeneral.cfgId);
            teamName = cfg.name;
            this.headIcon.getComponent(GeneralHeadLogic).setHeadId(this._firstGeneral.cfgId);
            this.labelStrength.string = "体力 " + this._firstGeneral.physical_power + "/" + cfg.physical_power_limit;
        }
        this.labelInfo.string = stateStr + " " + teamName + "队";

    }

    protected updateItem(): void {
        if (this._data && this._data.generals[0] != 0) {
            // console.log("updateItem", this._data);
            this.node.active = true;
            this._firstGeneral = GeneralCommand.getInstance().proxy.getMyGeneral(this._data.generals[0]);
            this.updateGeneralByData();

            this.labelPos.string = "(" + this._data.x + ", " + this._data.y + ")";

            this.labelSoldierCnt.string = "骑兵 " + (this._data.soldiers[0] + this._data.soldiers[1] + this._data.soldiers[2]);

            if (this._data.cmd == ArmyCmd.Idle) {
                
                this.btnSetting.active = true;
                let cityData: MapCityData = MapCommand.getInstance().cityProxy.getMyCityById(this._data.cityId);
                if (cityData && cityData.x == this._data.fromX && cityData.y == this._data.fromY){
                    //代表在城池里面
                    this.btnBack.active = false;
                }else{
                    //代表在城外据点待命
                    this.btnBack.active = true;
                }

            } else if (this._data.cmd == ArmyCmd.Conscript){
                this.btnSetting.active = false;
                this.btnBack.active = false;
            } else if (this._data.state == 0 && this._data.cmd != ArmyCmd.Reclaim) {
                //停留的时候才能配置队伍和撤退
                this.btnSetting.active = false;
                this.btnBack.active = true;
            } else {
                this.btnSetting.active = false;
                this.btnBack.active = false;
            }
        } else {
            this._firstGeneral = null;
            this.node.active = false;
        }
    }

    public setArmyData(data: ArmyData): void {
        this._data = data;
        this.updateItem();
    }
}
