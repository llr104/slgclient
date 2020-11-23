import ArmyCommand from "../general/ArmyCommand";
import { ArmyData } from "../general/ArmyProxy";
import { MapBuildAscription, MapBuildData } from "./MapBuildProxy";
import { MapCityData } from "./MapCityProxy";
import MapCommand from "./MapCommand";
import { MapResData } from "./MapProxy";

const { ccclass, property } = cc._decorator;

@ccclass
export default class MapClickUILogic extends cc.Component {
    @property(cc.Label)
    labelDes: cc.Label = null;
    @property(cc.Button)
    btnMove: cc.Button = null;
    @property(cc.Button)
    btnOccupy: cc.Button = null;

    protected _data: any = null;
    protected onLoad(): void {

    }

    protected onDestroy(): void {
        cc.systemEvent.targetOff(this);

    }

    protected onClickMove(): void {
        // let myCity: MapCityData = MapCommand.getInstance().cityProxy.getMyMainCity();
        // let armyData: ArmyData = ArmyCommand.getInstance().proxy.getFirstArmy(myCity.cityId);
        // if (armyData == null) {
        //     console.log("没有队伍");
        // } else {
        //     // ArmyCommand.getInstance().generalAssignArmy(armyData.id, 1, this._data.x, this._data.y, myCity);.
        //     cc.systemEvent.emit("open_general_dispose", myCity, this._data);
        // }
        this.node.parent = null;
    }

    protected onClickOccupy(): void {
        let myCity: MapCityData = MapCommand.getInstance().cityProxy.getMyMainCity();
        let armyData: ArmyData = ArmyCommand.getInstance().proxy.getFirstArmy(myCity.cityId);
        if (armyData == null) {
            console.log("没有队伍");
        } else {
            // ArmyCommand.getInstance().generalAssignArmy(armyData.id, 1, this._data.x, this._data.y, myCity);.
            cc.systemEvent.emit("open_general_dispose", myCity, this._data);
        }
        this.node.parent = null;
    }

    public setCellData(data: any, pixelPos: cc.Vec2): void {
        this._data = data;
        this.labelDes.string = "(" + data.x + ", " + data.y + ")";
        if (this._data instanceof MapResData) {
            //点击的是野外
            this.btnMove.node.active = true;
            this.btnOccupy.node.active = true;
        } else if (this._data instanceof MapBuildData) {
            //点击的是占领地
            if ((this._data as MapBuildData).ascription == MapBuildAscription.Me) {
                //我自己的地
                this.btnMove.node.active = true;
                this.btnOccupy.node.active = false;
            } else {
                this.btnMove.node.active = true;
                this.btnOccupy.node.active = true;
            }
        }
    }
}