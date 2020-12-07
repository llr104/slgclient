// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import GeneralCommand from "../../general/GeneralCommand";
import { GeneralData } from "../../general/GeneralProxy";
import LoginCommand from "../../login/LoginCommand";
import { Role } from "../../login/LoginProxy";
import DateUtil from "../../utils/DateUtil";
import MapUICommand from "./MapUICommand";
import { WarReport } from "./MapUIProxy";


const { ccclass, property } = cc._decorator;

@ccclass
export default class WarReportItemLogic extends cc.Component {


    private _curData:WarReport = null;

    @property([cc.Node])
    ackNode:cc.Node[] = [];


    @property([cc.Node])
    defNode:cc.Node[] = [];


    @property(cc.Node)
    winNode:cc.Node = null;


    @property(cc.Node)
    loseNode:cc.Node = null;


    @property(cc.Label)
    timeLabel: cc.Label = null;

    protected onLoad():void{
        this.winNode.active = this.loseNode.active = false;
    }


    protected updateItem(data:any):void{
        this._curData = data;

        var isRead = MapUICommand.getInstance().proxy.isRead(this._curData.id);
        this.node.opacity = isRead?120:255;

        this.setTeams(this.ackNode,this._curData.beg_attack_general);
        this.setTeams(this.defNode,this._curData.beg_defense_general);

        var roleData:Role = LoginCommand.getInstance().proxy.getRoleData();
        if(roleData.rid == this._curData.attack_rid){
            this.isMeWin(this._curData.attack_rid)
        }else{
            this.isMeWin(this._curData.defense_rid)
        }


        this.timeLabel.string = DateUtil.converTimeStr(this._curData.ctime);
    }



    protected isMeWin(rid:number = 0):void{
        var roleData:Role = LoginCommand.getInstance().proxy.getRoleData();
        this.winNode.active = this.loseNode.active = false;
        
        if(roleData.rid == rid){
            if(this._curData.result == 0){
                this.loseNode.active = true;
            }else if(this._curData.result == 1){

            }else{
                this.winNode.active = true;
            }
        }else{
            if(this._curData.result == 0){
                this.winNode.active = true;
            }else if(this._curData.result == 1){

            }else{
                this.loseNode.active = true;
            }
        }

    }





    protected setTeams(node:cc.Node[],generals:any[]){
        for(var i = 0; i < node.length ;i++){
            let item:cc.Node = node[i];
            let com = item.getComponent("GeneralItemLogic");
            var general = generals[i];
            if(general){
                item.active = true;
                if(com){
                    com.setWarReportData(general);
                }

            }else{
                item.active = false;
            }

        }
    }

    protected onClickItem():void{
        var isRead = MapUICommand.getInstance().proxy.isRead(this._curData.id);
        if(!isRead){
            MapUICommand.getInstance().warRead(this._curData.id);
        }

        cc.systemEvent.emit("click_war_report", this._curData);
       
    }
}
