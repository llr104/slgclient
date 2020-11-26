import { ArmyData } from "../../general/ArmyProxy";
import GeneralCommand from "../../general/GeneralCommand";
import ArmyCommand from "../../general/ArmyCommand";
import { GeneralConfig, GeneralData } from "../../general/GeneralProxy";
import { MapCityData } from "../MapCityProxy";
import MapCommand from "../MapCommand";
import DateUtil from "../../utils/DateUtil";

const { ccclass, property } = cc._decorator;

@ccclass
export default class RightArmyItemLogic extends cc.Component {
    @property(cc.Label)
    labelInfo: cc.Label = null;
    @property(cc.Label)
    labelPos: cc.Label = null;
    @property(cc.Node)
    bottomNode: cc.Node = null;
    @property(cc.Sprite)
    headIcon: cc.Sprite = null;
    @property(cc.Label)
    labelSoldierCnt: cc.Label = null;
    @property(cc.Label)
    labelStrength: cc.Label = null;
    @property(cc.Label)
    labelMorale: cc.Label = null;
    @property(cc.Node)
    btnBack: cc.Node = null;
    @property(cc.Node)
    btnSetting: cc.Node = null;

    protected _data: ArmyData = null;
    protected _firstGeneral:GeneralData = null;


    protected onLoad(): void {
        cc.systemEvent.on("update_generals", this.onUpdateGenerals, this);
        this.bottomNode.active = false;
    }

    protected onDestroy(): void {
        cc.systemEvent.targetOff(this);
        this._data = null;
    }

    protected update(): void {
        if (this._data && this._data.state > 0) {
            let nowTime: number = DateUtil.getServerTime();
            let time: number = Math.max(0, this._data.endTime - nowTime);
            this.labelPos.string = DateUtil.converSecondStr(time);
        }
    }

    protected onUpdateGenerals(ids: number[]): void {

    }

    protected onClickTop(): void {
        this.bottomNode.active = !this.bottomNode.active;
    }

    protected onClickBack(): void {
        if (this._data) {
            let cityData: MapCityData = MapCommand.getInstance().cityProxy.getMyMainCity();
            ArmyCommand.getInstance().generalAssignArmy(this._data.id, 3, cityData.x, cityData.y, null);
        }
    }

    protected onClickSetting(): void {
        if (this._data) {
            let cityData: MapCityData = MapCommand.getInstance().cityProxy.getMyCityById(this._data.cityId);
            cc.systemEvent.emit("open_general_dispose", cityData);
        }
    }

    protected updateGeneralByData():void {
        let stateStr: string = "";
        if (this._data.state > 0) {
            if (this._data.cmd == 3) {
                //撤退
                stateStr = "[撤退]";
            } else {
                stateStr = "[行军]";
            }
        } else {
            if (this._data.cmd == 0) {
                //撤退
                stateStr = "[待命]";
            } else {
                stateStr = "[停留]";
            }
        }
        
        var teamName = "";
        if (this._firstGeneral) {
            let cfg: GeneralConfig = GeneralCommand.getInstance().proxy.getGeneralCfg(this._firstGeneral.cfgId);
            teamName = cfg.name;
            this.headIcon.spriteFrame = GeneralCommand.getInstance().proxy.getGeneralTex(this._firstGeneral.cfgId);
            this.labelStrength.string = "体力 " + this._firstGeneral.physical_power + "/" + cfg.physical_power_limit;
        }
        this.labelInfo.string = stateStr + " " + teamName + "队";
        
    }

    protected updateItem(): void {
        if (this._data && this._data.generals[0] != 0) {
            this.node.active = true;
            this._firstGeneral = GeneralCommand.getInstance().proxy.getMyGeneral(this._data.generals[0]);
            this.updateGeneralByData();
            
            this.labelPos.string = "(" + this._data.x + ", " + this._data.y + ")";
            
            this.labelSoldierCnt.string = "骑兵 " + (this._data.soldiers[0] + this._data.soldiers[1] + this._data.soldiers[2]);

            if (this._data.cmd == 0) {
                //代表在城池里面
                this.btnSetting.active = true;
                this.btnBack.active = false;
            } else if (this._data.state == 0) {
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