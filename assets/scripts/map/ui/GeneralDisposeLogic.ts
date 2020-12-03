// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import ArmyCommand from "../../general/ArmyCommand";
import { ArmyCmd, ArmyData } from "../../general/ArmyProxy";
import GeneralCommand from "../../general/GeneralCommand";
import { GeneralData } from "../../general/GeneralProxy";
import MapCommand from "../MapCommand";

const { ccclass, property } = cc._decorator;

@ccclass
export default class GeneralDisposeLogic extends cc.Component {


    
    @property(cc.Prefab)
    generalGroupPrefab: cc.Prefab = null;

    @property(cc.Node)
    pageNode: cc.Node = null;
    
    @property(cc.Layout)
    pageLayout:cc.Layout = null;

    @property(cc.Label)
    costLabel: cc.Label = null;


    private _cityData:any = null;
    private _outPos:any = null;
    private _orderIndex:number = 0;
    private _maxOrder:number = 5;
    private _type:number = 0;//1 占领 2是驻军

    protected onLoad():void{
        cc.systemEvent.on("update_army_list", this.onGeneralArmyList, this);
        cc.systemEvent.on("update_army", this.onGeneralArmyList, this);
        this.pageNode.on("scroll-ended",this.onPageChange,this);
        cc.systemEvent.on("chosed_general", this.onChoseGeneral, this);
        cc.systemEvent.on("update_army_assign", this.onClickClose, this);
        this.initView();
    }


    private initView():void{
        for(var i = 0; i < this._maxOrder;i++){
            var group = cc.instantiate(this.generalGroupPrefab);
            group.parent = this.pageLayout.node;
            group.y = 40;
        }
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

        this.costLabel.string = "cost:" + MapCommand.getInstance().cityProxy.getMyCityById(this._cityData.cityId).cost;
    }




    protected onGeneralArmyList():void{
        let cityArmyData: ArmyData[] = ArmyCommand.getInstance().proxy.getArmyList(this._cityData.cityId);
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

            ArmyCommand.getInstance().generalAssignArmy(id, ArmyCmd.Attack, this._outPos.x, this._outPos.y, this._cityData);
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
            ArmyCommand.getInstance().generalAssignArmy(id, ArmyCmd.Garrison, this._outPos.x, this._outPos.y, this._cityData);
        }
        
    }
}
