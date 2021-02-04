import MapUICommand from "./MapUICommand";
import { Facility, FacilityAdditionCfg, FacilityConfig, CityAdditionType } from "./MapUIProxy";


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
