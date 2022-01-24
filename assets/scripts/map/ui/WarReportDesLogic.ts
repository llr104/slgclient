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

    onEnable(){
        this.scrollView.scrollToTop();
    }

    public setData(data:any):void{
        
        this.scrollView.content.removeAllChildren();
        this._curData = data;
       
        for (let index = 0; index < this._curData.rounds.length; index++) {
            let r = this._curData.rounds[index];
            
            let item = instantiate(this.item);
            item.active = true;
            item.parent = this.scrollView.content;

            item.getComponent(WarReportDesItemLogic).setData(r, this._curData, index == this._curData.rounds.length-1);
        }
        
        this.scrollView.scrollToTop();
    }


    protected onClickClose(): void {
        this.node.active = false;
        AudioManager.instance.playClick();
    }
}
