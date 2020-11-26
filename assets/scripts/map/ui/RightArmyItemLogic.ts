import { ArmyData } from "../../general/ArmyProxy";
import GeneralCommand from "../../general/GeneralCommand";
import ArmyCommand from "../../general/ArmyCommand";
import { GeneralData } from "../../general/GeneralProxy";
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


    protected onLoad(): void {
        this.bottomNode.active = false;
    }

    protected onDestroy(): void {
        this._data = null;
    }

    protected update(): void {
        if (this._data && this._data.state > 0) {
            let nowTime: number = DateUtil.getServerTime();
            let time: number = Math.max(0, this._data.endTime - nowTime);
            this.labelPos.string = DateUtil.converSecondStr(time);
        }
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

        }
    }

    protected updateItem(): void {
        if (this._data && this._data.generals[0] != 0) {
            this.node.active = true;
            let stateStr: string = this._data.state > 0 ? "[行军]" : "[停留]";
            let generalData: GeneralData = GeneralCommand.getInstance().proxy.getMyGeneral(this._data.generals[0]);
            var teamName = "";
            if(generalData){
                teamName =  GeneralCommand.getInstance().proxy.getGeneralCfg(generalData.cfgId).name;
            }
            
            let nameStr: string = teamName + "队";
            this.labelInfo.string = stateStr + " " + nameStr;
            this.labelPos.string = "(" + this._data.x + ", " + this._data.y + ")";
            this.headIcon.spriteFrame = GeneralCommand.getInstance().proxy.getGeneralTex(generalData.cfgId);
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
            this.node.active = false;
        }
    }

    public setArmyData(data: ArmyData): void {
        this._data = data;
        this.updateItem();
    }
}