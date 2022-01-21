import { _decorator, Component, ScrollView, Node, instantiate } from 'cc';
import { AudioManager } from '../../common/AudioManager';

const { ccclass, property } = _decorator;
import { WarReport } from "./MapUIProxy";
import WarReportDesItemLogic from './WarReportDesItemLogic';

@ccclass('WarReportDesLogic')
export default class WarReportDesLogic extends Component {


    private _curData:WarReport = null;

    @property(ScrollView)
    scrollView:ScrollView = null;

    @property(Node)
    item:Node = null;


    onLoad(){
        this.item.active = false;
    }

    public setData(data:any):void{
        
        this.scrollView.content.removeAllChildren();
        this._curData = data;
        console.log("WarReportDesLogic:", this._curData);
    
        for (let index = 0; index < this._curData.rounds.length; index++) {
            let r = this._curData.rounds[index];
            
            let item = instantiate(this.item);
            item.active = true;
            item.parent = this.scrollView.content;

            item.getComponent(WarReportDesItemLogic).setData(r, this._curData);
        }
        
    }


    protected onClickClose(): void {
        this.node.active = false;
        AudioManager.instance.playClick();
    }
}
