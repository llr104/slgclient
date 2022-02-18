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

    _lastY:number = 0;

    _curNum:number = 0;

    onLoad(){
        this.item.active = false;
        this.scrollView.node.on("scroll-to-bottom", this.scrollToBottom, this);
    }


    onEnable(){
        this.scrollView.scrollToTop();
        
    }

    public setData(data:any):void{
        
        this.scrollView.content.removeAllChildren();
        this._curData = data;
        this._curNum =  0;
        this.make();

        this.scrollView.scrollToTop();
    }

    private make() {
        let max = Math.min(6, this._curData.rounds.length-this._curNum);
        
        for (let index = this._curNum; index < this._curNum + max; index++) {
            let r = this._curData.rounds[index];
            
            let item = instantiate(this.item);
            item.active = true;
            item.parent = this.scrollView.content;

            item.getComponent(WarReportDesItemLogic).setData(r, this._curData, index == this._curData.rounds.length-1);
        }

        this._curNum += max;
    }


    protected onClickClose(): void {
        this.node.active = false;
        AudioManager.instance.playClick();
    }


    protected scrollToBottom(): void {
        console.log("scrollToBottom");
        this.make();
    }
    

}
