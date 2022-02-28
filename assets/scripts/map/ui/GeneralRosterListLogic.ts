
import { _decorator, Component, ScrollView } from 'cc';
import { AudioManager } from '../../common/AudioManager';
import { LogicEvent } from '../../common/LogicEvent';
const { ccclass, property } = _decorator;

import GeneralCommand from "../../general/GeneralCommand";
import { GeneralConfig } from "../../general/GeneralProxy";
import { EventMgr } from '../../utils/EventMgr';
import ListLogic from '../../utils/ListLogic';

@ccclass('GeneralRosterListLogic')
export default class GeneralRosterListLogic extends Component {


    @property(ScrollView)
    scrollView:ScrollView = null;

    protected onEnable(): void {
        this.initGeneralCfg();
    }

    protected onClickClose(): void {
        AudioManager.instance.playClick();
        this.node.active = false;
        EventMgr.emit(LogicEvent.openGeneral);
    }


    protected initGeneralCfg():void{

        let cfgs = GeneralCommand.getInstance().proxy.getGeneralAllCfg();
        var arr = Array.from(cfgs.values());
        arr.sort(this.sortStar);

        var comp = this.scrollView.node.getComponent(ListLogic);
        comp.setData(arr);

    }

    protected sortStar(a: GeneralConfig, b: GeneralConfig): number {

        if(a.star < b.star){
            return 1;
        }else if(a.star == b.star){
            return a.cfgId - b.cfgId;
        }else{
            return -1;
        }
    }
}
