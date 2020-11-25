// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import ArmyCommand from "../../general/ArmyCommand";
import { ArmyData } from "../../general/ArmyProxy";
import GeneralCommand from "../../general/GeneralCommand";
import { GeneralData } from "../../general/GeneralProxy";

const { ccclass, property } = cc._decorator;

@ccclass
export default class GeneralDisposeLogic extends cc.Component {


    
    @property(cc.Prefab)
    generalGroupPrefab: cc.Prefab = null;

    @property(cc.Node)
    pageNode: cc.Node = null;

    
    @property(cc.Layout)
    pageLayout:cc.Layout = null;


    @property(cc.Node)
    outNode: cc.Node = null;

    @property(cc.Node)
    inNode: cc.Node = null;

    
    @property(cc.Label)
    stateNode: cc.Label = null;

    private _cityData:any = null;
    private _outPos:any = null;
    private _orderIndex:number = 0;
    private _maxOrder:number = 5;
    private _type:number = 0;//1 占领 2是驻军

    protected onLoad():void{
        // cc.systemEvent.on("update_my_generals", this.initGeneralCfg, this);
        cc.systemEvent.on("update_army_list", this.onGeneralArmyList, this);
        cc.systemEvent.on("update_army", this.onGeneralArmyList, this);
        this.pageNode.on("scroll-ended",this.onPageChange,this);
        cc.systemEvent.on("chosed_general", this.onChoseGeneral, this);
        cc.systemEvent.on("update_army_assign", this.onClickClose, this);

        this.stateNode.node.active = this.outNode.active = this.inNode.active = false;
        
    }


    public setData(data:any,outPos:any = null,type:number = 0):void{
        this._cityData = data;
        this._outPos = outPos
        this._type = type;

        
        let list:GeneralData[] = GeneralCommand.getInstance().proxy.getMyGenerals();
        if (list.length <= 0) {
            GeneralCommand.getInstance().qryMyGenerals();
        } else {
            this.onGeneralArmyList();
        }
        let armyList:ArmyData[] = ArmyCommand.getInstance().proxy.getArmyList(this._cityData.cityId);
        if (armyList == null) {
            ArmyCommand.getInstance().qryArmyList(this._cityData.cityId);
        } else {
            this.onGeneralArmyList();
        }
    }




    protected onGeneralArmyList():void{
        let cityArmyData: ArmyData[] = ArmyCommand.getInstance().proxy.getArmyList(this._cityData.cityId);
        // console.log("onGeneralArmyList", cityArmyData, this._orderIndex, this._cityData.cityId);
        // this.pageLayout.node.removeAllChildren();
        if(cityArmyData != null){
            var children = this.pageLayout.node.children;

            for(var i = 0;i < children.length; i++){
                let item:cc.Node = children[i];
                let com = item.getComponent("GeneralGroupLogic");
                if(com){
                    com.setData(cityArmyData[i],this._cityData, i);
                }
            }
        }

        this.updateView();
    }

    protected onPageChange(target:any):void{
        this._orderIndex = target.getCurrentPageIndex();
        this.updateView();
    }




    protected updateView():void{
        let cityArmyData: ArmyData[] = ArmyCommand.getInstance().proxy.getArmyList(this._cityData.cityId);
        if(this._outPos && cityArmyData[this._orderIndex]){
            var state = cityArmyData[this._orderIndex].state;


            if(this._type == 1){
                this.outNode.active = (state == 0?true:false);
                this.stateNode.node.active = !this.outNode.active;
    
                if(state == 1){
                    this.stateNode.string = '进攻中.....'
                }else if(state == 3){
                    this.stateNode.string = '返回中.....'
                }
    
            }else if(this._type == 2){
                this.inNode.active = true;
            }


        }else{
            this.stateNode.node.active = this.inNode.active = this.outNode.active = false;
            
        }
    }



    protected onChoseGeneral(cfgData:any ,curData:any,position:any):void{
        ArmyCommand.getInstance().generalDispose(this._cityData.cityId , curData.id,this._orderIndex + 1,Number(position),this._cityData);
    }

    protected onDestroy():void{
        cc.systemEvent.targetOff(this);
    }

    protected onClickClose(): void {
        this.node.active = false;
    }


    protected onClickOccupy():void{
        let cityArmyData: ArmyData[] = ArmyCommand.getInstance().proxy.getArmyList(this._cityData.cityId);
        if(cityArmyData){
            var id = cityArmyData[this._orderIndex].id;
            var generals = cityArmyData[this._orderIndex].generals;
            if(generals[0] == 0){
                console.log("第一个武将要配置")
                return;
            }

            ArmyCommand.getInstance().generalAssignArmy(id, 1, this._outPos.x, this._outPos.y, this._cityData);
        }
        
    }


    protected onClickStationed():void{
        let cityArmyData: ArmyData[] = ArmyCommand.getInstance().proxy.getArmyList(this._cityData.cityId);
        if(cityArmyData){
            var id = cityArmyData[this._orderIndex].id;
            var generals = cityArmyData[this._orderIndex].generals;
            if(generals[0] == 0){
                console.log("第一个武将要配置")
                return;
            }
            ArmyCommand.getInstance().generalAssignArmy(id, 2, this._outPos.x, this._outPos.y, this._cityData);
        }
        
    }
}
