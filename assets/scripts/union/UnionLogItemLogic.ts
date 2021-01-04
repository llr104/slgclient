// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import LoginCommand from "../login/LoginCommand";
import { Role } from "../login/LoginProxy";
import DateUtil from "../utils/DateUtil";
import UnionCommand from "./UnionCommand";
import { Apply, Member, Union } from "./UnionProxy";


const { ccclass, property } = cc._decorator;

@ccclass
export default class UnionApplyItemLogic extends cc.Component {


    @property(cc.Label)
    desLabel: cc.Label = null;

    @property(cc.Label)
    timeLabel: cc.Label = null;

    protected onLoad():void{
        
    }

    protected updateItem(data:any):void{
       this.desLabel.string = data.des;
       this.timeLabel.string = DateUtil.converTimeStr(data.ctime,  "YYYY-MM-DD hh:mm:ss");
    }

}
