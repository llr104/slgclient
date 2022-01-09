
import DateUtil from "../utils/DateUtil";
import { ChatMsg } from "./ChatProxy";
import { _decorator, Component, Label } from "cc";


const { ccclass, property } = _decorator;
@ccclass('ChatItemLogic')
export default class ChatItemLogic extends Component {


    @property(Label)
    nameLabel: Label = null;


    protected onLoad():void{
    }

    protected updateItem(data:ChatMsg):void{
        var time = DateUtil.converTimeStr(data.time * 1000);
        this.nameLabel.string = time + " " + data.nick_name + ":"  +data.msg;
    }

}
