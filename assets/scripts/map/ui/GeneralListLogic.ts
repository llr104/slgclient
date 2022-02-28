
import { _decorator, Component, ScrollView, Label } from 'cc';
const { ccclass, property } = _decorator;

import GeneralCommand from "../../general/GeneralCommand";
import MapUICommand from "./MapUICommand";
import { EventMgr } from '../../utils/EventMgr';
import ListLogic from '../../utils/ListLogic';
import { AudioManager } from '../../common/AudioManager';
import { LogicEvent } from '../../common/LogicEvent';

@ccclass('GeneralListLogic')
export default class GeneralListLogic extends Component {

    @property(ScrollView)
    scrollView:ScrollView = null;

    @property(Label)
    cntLab:Label = null;

    private _cunGeneral:number[] = [];
    private _type:number = 0;
    private _position:number = 0;

    protected onEnable():void{
        EventMgr.on(LogicEvent.updateMyGenerals, this.initGeneralCfg, this);
        EventMgr.on(LogicEvent.generalConvert, this.initGeneralCfg, this);
        EventMgr.on(LogicEvent.chosedGeneral, this.onClickClose, this);
    }


    protected onDisable():void{
        EventMgr.targetOff(this);
    }

    protected onClickClose(): void {
        AudioManager.instance.playClick();
        this.node.active = false;
    }

    protected onClickConvert(): void {
        AudioManager.instance.playClick();
        EventMgr.emit(LogicEvent.openGeneralConvert);
        this.node.active = false;
    }

    protected onTuJianConvert(): void {
        AudioManager.instance.playClick();
        EventMgr.emit(LogicEvent.openGeneralRoster);
        this.node.active = false;
    }

    protected initGeneralCfg():void{

        var basic = MapUICommand.getInstance().proxy.getBasicGeneral();
        var cnt = GeneralCommand.getInstance().proxy.getMyActiveGeneralCnt();
        this.cntLab.string = "(" + cnt + "/" + basic.limit + ")";

        let list:any[] = GeneralCommand.getInstance().proxy.getUseGenerals();
        let listTemp = list.concat();


        listTemp.forEach(item => {
            item.type = this._type;
            item.position = this._position;
        })


        for(var i = 0; i < listTemp.length ;i++){
            if(this._cunGeneral.indexOf(listTemp[i].id) >= 0 ){
                listTemp.splice(i,1);
                i--;
            }
        }

        var comp = this.scrollView.node.getComponent(ListLogic);
        comp.setData(listTemp);
    }



    public setData(data:number[],type:number = 0,position:number = 0):void{
        this._cunGeneral = [];
        if(data && data.length > 0){
            this._cunGeneral = data;
        }
        
        this._type = type;
        this._position = position;

        this.initGeneralCfg();
        GeneralCommand.getInstance().qryMyGenerals();
    }

}
