import { _decorator, Component, ScrollView } from 'cc';
import ListLogic from '../../utils/ListLogic';
const { ccclass, property } = _decorator;
import { WarReport } from "./MapUIProxy";

@ccclass('WarReportDesLogic')
export default class WarReportDesLogic extends Component {


    private _curData:WarReport = null;


    @property(ScrollView)
    scrollView:ScrollView = null;

   
    protected onLoad():void{
    }


    public setData(data:any):void{
        
        this._curData = data;
        console.log("WarReportDesLogic rounds:", this._curData.rounds);
        
        var comp = this.scrollView.node.getComponent(ListLogic);
        comp.setData(this._curData.rounds);
    }


    protected onClickClose(): void {
        this.node.active = false;
    }
}
