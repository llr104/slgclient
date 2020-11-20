import ArmyCommand from "../general/ArmyCommand";
import { ArmyData } from "../general/ArmyProxy";
import MapCommand from "./MapCommand";
import { MapCityData } from "./MapProxy";

const { ccclass, property } = cc._decorator;

@ccclass
export default class MapClickUILogic extends cc.Component {
    @property(cc.Label)
    labelDes: cc.Label = null;

    protected _data: any = null;
    protected onLoad(): void {

    }

    protected onDestroy(): void {
        cc.systemEvent.targetOff(this);

    }

    protected onClickOccupy(): void {
        let myCity: MapCityData = MapCommand.getInstance().proxy.getMyMainCity();
        let armyData: ArmyData = ArmyCommand.getInstance().proxy.getFirstArmy(myCity.cityId);
        if (armyData == null) {
            console.log("没有队伍");
        } else {
            ArmyCommand.getInstance().generalAssignArmy(armyData.id, 1, this._data.x, this._data.y, myCity);
        }
        this.node.parent = null;
    }

    public setCellData(data: any, pixelPos: cc.Vec2): void {
        this._data = data;
        this.labelDes.string = "(" + data.x + ", " + data.y + ")";
    }
}