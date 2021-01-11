import ArmyCommand from "../../general/ArmyCommand";
import { ArmyData } from "../../general/ArmyProxy";
import { MapBuildData } from "../MapBuildProxy";
import CityArmyItemLogic from "./CityArmyItemLogic";
import MapUICommand from "./MapUICommand";
import { CityAddition } from "./MapUIProxy";

const { ccclass, property } = cc._decorator;

@ccclass
export default class FortressAbout extends cc.Component {
    @property(cc.Node)
    armyLayer: cc.Node = null;
    @property(cc.Prefab)
    armyItem: cc.Prefab = null;

    protected _armyCnt: number = 5;//队伍数量 固定值
    protected _buildData: MapBuildData = null;
    protected _armyComps: CityArmyItemLogic[] = [];

    protected onLoad(): void {
        this.initView();
    }

    protected onDestroy(): void {
        cc.systemEvent.targetOff(this);
    }

    protected initView(): void {
        for (let i: number = 0; i < this._armyCnt; i++) {
            let item = cc.instantiate(this.armyItem);
            item.parent = this.armyLayer;
            let comp: CityArmyItemLogic = item.getComponent(CityArmyItemLogic);
            comp.order = i + 1;
            this._armyComps.push(comp);
        }
    }


    protected updateArmyList(): void {
        let armyList: ArmyData[] = ArmyCommand.getInstance().proxy.getArmysByPos(this._buildData.x, this._buildData.y);
        for (let i: number = 0; i < this._armyComps.length; i++) {
            if (this._buildData.level > i){
                this._armyComps[i].isOpenedArmy(true, true);
            }else{
                this._armyComps[i].isOpenedArmy(false, true);
            }

            if (armyList.length > i){
                this._armyComps[i].setArmyData(armyList[i].cityId, armyList[i]);
            }
        }
    }

    public setData(data: MapBuildData): void {
        this._buildData = data;
        this.updateArmyList();
    }


  
    protected onClickUpBuild(): void {
 
    }

    protected onClickDestroyBuild(): void {
  
    }

    protected onClickClose(): void {
        this.node.active = false;
    }
}
