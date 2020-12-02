import MapUICommand from "./MapUICommand";
import { Facility, FacilityAdditionCfg, FacilityConfig } from "./MapUIProxy";

const { ccclass, property } = cc._decorator;

@ccclass
export default class FacilityAdditionItemLogic extends cc.Component {
    @property(cc.Label)
    labelName: cc.Label = null;
    @property(cc.Node)
    upNode: cc.Node = null;
    @property(cc.Node)
    maxNode: cc.Node = null;
    @property(cc.Label)
    labelOld: cc.Label = null;
    @property(cc.Label)
    labelNew: cc.Label = null;
    @property(cc.Label)
    labeMax: cc.Label = null;

    protected onLoad(): void {
        
    }

    protected onDestroy(): void {
        
    }

    public setData(data:Facility, cfg:FacilityConfig, index:number): void {
        let additionType:number = cfg.additions[index];
        let additionCfg: FacilityAdditionCfg = MapUICommand.getInstance().proxy.getFacilityAdditionCfgByType(additionType);
        this.labelName.string = additionCfg.des;
        if (data.level >= cfg.upLevels.length) {
            //达到最大等级
            this.upNode.active = false;
            this.maxNode.active = true;
            this.labeMax.string = additionCfg.value.replace("%n%", cfg.upLevels[data.level - 1].values[index] + "");
        } else {
            this.upNode.active = true;
            this.maxNode.active = false;
            if (data.level == 0) {
                //代表未升级过
                this.labelOld.string = "---";
            } else {
                this.labelOld.string = additionCfg.value.replace("%n%", cfg.upLevels[data.level - 1].values[index] + "");
            }
            this.labelNew.string = additionCfg.value.replace("%n%", cfg.upLevels[data.level].values[index] + "");
        }
    }
}
