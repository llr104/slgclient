// // Learn TypeScript:
// //  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// // Learn Attribute:
// //  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// // Learn life-cycle callbacks:
// //  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { _decorator, Component, Label } from 'cc';
const { ccclass, property } = _decorator;


import UnionCommand from "./UnionCommand";
import { Member } from "./UnionProxy";
import { EventMgr } from '../utils/EventMgr';
import { AudioManager } from '../common/AudioManager';
import { LogicEvent } from '../common/LogicEvent';

@ccclass('UnionMemItemLogic')
export default class UnionMemItemLogic extends Component {

    @property(Label)
    nameLabel: Label = null;

    @property(Label)
    titleLabel: Label = null;

    @property(Label)
    posLabel: Label = null;

    protected _menberData:Member = null;

    protected onLoad():void{
    }

    protected updateItem(data:Member):void{
        this._menberData = data;
        this.titleLabel.string = "(" + this._menberData.titleDes + ")";
        this.nameLabel.string = this._menberData.name;
        this.posLabel.string = "坐标:(" + this._menberData.x + "," + this._menberData.y+")";
    }

    protected click():void{
        AudioManager.instance.playClick();
        EventMgr.emit(LogicEvent.clickUnionMemberItem, this._menberData);
    }

    protected kick():void{
        AudioManager.instance.playClick();
        UnionCommand.getInstance().unionKick(this._menberData.rid);
    }

    
    protected appoint():void{
        AudioManager.instance.playClick();
        UnionCommand.getInstance().unionKick(this._menberData.rid);
    }

    protected abdicate():void{
        AudioManager.instance.playClick();
        UnionCommand.getInstance().unionKick(this._menberData.rid);
    }
    
    protected jump():void{
        AudioManager.instance.playClick();
        EventMgr.emit(LogicEvent.closeUnion);
        EventMgr.emit(LogicEvent.scrollToMap, this._menberData.x, this._menberData.y);
    }

}
