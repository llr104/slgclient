import { _decorator, Component, Label, Node } from 'cc';
const { ccclass, property } = _decorator;

import MapUICommand from "./MapUICommand";
import { Facility, FacilityAdditionCfg, FacilityConfig, CityAdditionType } from "./MapUIProxy";

@ccclass('FacilityAdditionItemLogic')
export default class FacilityAdditionItemLogic extends Component {
    @property(Label)
    labelName: Label = null;
    @property(Node)
    upNode: Node = null;
    @property(Node)
    maxNode: Node = null;
    @property(Label)
    labelOld: Label = null;
    @property(Label)
    labelNew: Label = null;
    @property(Label)
    labeMax: Label = null;

    public setData(data:Facility, cfg:FacilityConfig, index:number): void {
        let additionType:number = cfg.additions[index];
        let additionCfg: FacilityAdditionCfg = MapUICommand.getInstance().proxy.getFacilityAdditionCfgByType(additionType);
        this.labelName.string = additionCfg.des;
        if (data.level >= cfg.upLevels.length) {
            //达到最大等级
            this.upNode.active = false;
            this.maxNode.active = true;

            var v = cfg.upLevels[data.level - 1].values[index];
            if(additionType == CityAdditionType.Durable){
                v = v/100
            }
            this.labeMax.string = additionCfg.value.replace("%n%",  v+ "");
        } else {
            this.upNode.active = true;
            this.maxNode.active = false;
            if (data.level == 0) {
                //代表未升级过
                this.labelOld.string = "---";
            } else {

                var v = cfg.upLevels[data.level - 1].values[index];
                if(additionType == CityAdditionType.Durable){
                    v = v/100
                }

                this.labelOld.string = additionCfg.value.replace("%n%", v + "");
            }

            var v = cfg.upLevels[data.level].values[index];
            if(additionType == CityAdditionType.Durable){
                v = v/100
            }

            this.labelNew.string = additionCfg.value.replace("%n%", v + "");
        }
    }
}
