// // Learn TypeScript:
// //  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// // Learn Attribute:
// //  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// // Learn life-cycle callbacks:
// //  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { _decorator, Component, Label } from 'cc';
const { ccclass, property } = _decorator;

import DateUtil from "../utils/DateUtil";
@ccclass('UnionLogItemLogic')
export default class UnionApplyItemLogic extends Component {
    @property(Label)
    desLabel: Label | null = null;
    @property(Label)
    timeLabel: Label | null = null;
    protected onLoad():void{

    }
    protected updateItem(data:any):void{
        this.desLabel.string = data.des;
        this.timeLabel.string = DateUtil.converTimeStr(data.ctime,  "YYYY-MM-DD hh:mm:ss");
    }
}

