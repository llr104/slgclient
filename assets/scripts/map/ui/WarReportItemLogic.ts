// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import GeneralCommand from "../../general/GeneralCommand";
import { GeneralData } from "../../general/GeneralProxy";
import MapUICommand from "./MapUICommand";
import { WarReport } from "./MapUIProxy";


const { ccclass, property } = cc._decorator;

@ccclass
export default class WarReportItemLogic extends cc.Component {


    private _curData:WarReport = null;
    protected onLoad():void{

    }


    protected setData(data:any):void{
        this._curData = data;

        var isRead = MapUICommand.getInstance().proxy.isRead(this._curData.id);
        this.node.color = isRead?cc.color(122,122,122,122):cc.color(255,255,255,255);
    }

    protected onClickItem():void{
        MapUICommand.getInstance().warRead(this._curData.id);
    }
}
