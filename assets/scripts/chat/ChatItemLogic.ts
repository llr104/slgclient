// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import DateUtil from "../utils/DateUtil";
import { ChatMsg } from "./ChatProxy";



const { ccclass, property } = cc._decorator;

@ccclass
export default class ChatItemLogic extends cc.Component {


    @property(cc.Label)
    nameLabel: cc.Label = null;


    protected onLoad():void{
    }

    protected updateItem(data:ChatMsg):void{
        var time = DateUtil.converTimeStr(data.time * 1000);
        this.nameLabel.string = time + " " + data.nick_name + ":"  +data.msg;
    }

}
