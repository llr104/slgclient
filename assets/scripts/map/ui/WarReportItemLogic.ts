import { _decorator, Component, Node, Label } from 'cc';
const { ccclass, property } = _decorator;

import LoginCommand from "../../login/LoginCommand";
import { Role } from "../../login/LoginProxy";
import DateUtil from "../../utils/DateUtil";
import MapUICommand from "./MapUICommand";
import { WarReport } from "./MapUIProxy";
import { EventMgr } from '../../utils/EventMgr';
import GeneralItemLogic from './GeneralItemLogic';

@ccclass('WarReportItemLogic')
export default class WarReportItemLogic extends Component {


    private _curData:WarReport = null;

    @property(Node)
    readBg:Node = null;

    @property([Node])
    ackNode:Node[] = [];


    @property([Node])
    defNode:Node[] = [];


    @property(Node)
    winNode:Node = null;


    @property(Node)
    loseNode:Node = null;


    @property(Label)
    timeLabel: Label = null;


    @property(Label)
    leftLabel: Label = null;


    @property(Label)
    rightLabel: Label = null;

    protected onLoad():void{
        this.winNode.active = this.loseNode.active = false;
    }


    protected updateItem(data:any):void{
        this._curData = data;

        var isRead = MapUICommand.getInstance().proxy.isRead(this._curData.id);
        this.readBg.active = isRead;
       

        this.setTeams(this.ackNode,this._curData.beg_attack_general);
        this.setTeams(this.defNode,this._curData.beg_defense_general);

        var roleData:Role = LoginCommand.getInstance().proxy.getRoleData();
        this.isMeWin(this._curData.attack_rid)
        
        this.leftLabel.string = roleData.rid == this._curData.attack_rid?"我":"敌";
        this.rightLabel.string = roleData.rid == this._curData.defense_rid?"我":"敌"

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





    protected setTeams(node:Node[],generals:any[]){
        for(var i = 0; i < node.length ;i++){
            let item:Node = node[i];
            let com = item.getComponent(GeneralItemLogic);
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

        console.log("click_war_report:", this._curData);
        EventMgr.emit("click_war_report", this._curData);
       
    }
}
