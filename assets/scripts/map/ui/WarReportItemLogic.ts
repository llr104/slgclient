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

    @property(cc.Label)
    actMsgLabel: cc.Label = null;

    @property(cc.Label)
    defMsgLabel: cc.Label = null;


    @property(cc.Label)
    timeLabel: cc.Label = null;

    protected onLoad():void{

    }


    protected updateItem(data:any):void{
        this._curData = data;

        var isRead = MapUICommand.getInstance().proxy.isRead(this._curData.id);
        this.node.opacity = isRead?120:255;

        this.setTeams(this.ackNode,this._curData.beg_attack_general);
        this.setTeams(this.defNode,this._curData.beg_defense_general);

        
        this.actMsgLabel.string = this.isMe(this._curData.attack_rid) + this.isAttackWin();
        this.defMsgLabel.string = this.isMe(this._curData.defense_rid) + this.isAttackWin();

        this.timeLabel.string = DateUtil.converTimeStr(this._curData.ctime);
    }

    protected isMe(rid:number = 0):string{
        var roleData:Role = LoginCommand.getInstance().proxy.getRoleData();
        if(roleData.rid == rid){
            return "我方"
        }

        return "敌方"
    }


    protected isAttackWin():string{
        if(this._curData.result == 0){
            return "败"   
        }

        if(this._curData.result == 1){
            return "平"   
        }

        return "胜"   
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
       
    }
}
