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


    @property(cc.Node)
    generalNode: cc.Node = null;

    @property(cc.Layout)
    srollLayout:cc.Layout = null;


    @property([cc.Node])
    picNode: cc.Node[] = [];


    private _generalDisposeArr:any[] = [];
    private _cityData:any = null;
    private _orderIndex:number = 0;


    protected onLoad():void{
        console.log("onLoad GeneralDisposeLogic");
        cc.systemEvent.on("update_my_generals", this.initGeneralCfg, this);
        cc.systemEvent.on("update_army_list", this.onGeneralArmyList, this);
        cc.systemEvent.on("update_army", this.onGeneralArmyList, this);
    }


    protected onDestroy():void{
        cc.systemEvent.targetOff(this);
    }

    protected onClickClose(): void {
        this.node.active = false;
    }


    public setData(data:any):void{
        this.clearDisPose();
        this._cityData = data;

        // this.initGeneralCfg();
        
        let list:GeneralData[] = GeneralCommand.getInstance().proxy.getMyGenerals();
        if (list.length <= 0) {
            GeneralCommand.getInstance().qryMyGenerals();
        } else {
            this.initGeneralCfg();
        }
        let armyList:ArmyData[] = ArmyCommand.getInstance().proxy.getArmyList(this._cityData.cityId);
        if (armyList == null) {
            ArmyCommand.getInstance().qryArmyList(this._cityData.cityId);
        } else {
            this.onGeneralArmyList();
        }
    }


    protected onGeneralArmyList():void{
        this.clearDisPose();
        
        let cityArmyData: ArmyData = ArmyCommand.getInstance().proxy.getArmyByOrder(this._orderIndex + 1, this._cityData.cityId);
        console.log("onGeneralArmyList", cityArmyData, this._orderIndex, this._cityData.cityId);
        if(cityArmyData != null){
            var children = this.srollLayout.node.children;
            for(var i = 0;i < children.length;i++){
                var child = children[i];
                var toggle = child.getComponent(cc.Toggle);
                toggle.isChecked = false;
                var curData = toggle.curData;
                // console.log("curData.id:",curData.id)
                if(curData.id == cityArmyData.firstId || curData.id == cityArmyData.secondId || curData.id == cityArmyData.thirdId){
                    toggle.isChecked = true;
                    // this.dispose(toggle);
    
                    if(curData.id == cityArmyData.firstId){
                        this._generalDisposeArr[0] = (curData);
                    }
                    
                    if(curData.id == cityArmyData.secondId){
                        this._generalDisposeArr[1] = (curData);
                    }
    
                    if(curData.id == cityArmyData.thirdId){
                        this._generalDisposeArr[2] = (curData);
                    }
                }
            }
        }


        this.updateView();
    }


    protected initGeneralCfg():void{
        
        let list:GeneralData[] = GeneralCommand.getInstance().proxy.getMyGenerals();
        console.log("initGeneralCfg", list);
        for (let i:number = 0; i < list.length; i++) {
            let item:cc.Node = cc.instantiate(this.generalNode);
            item.active = true;
            item.getChildByName("name").getComponent(cc.Label).string = list[i].name;
            item.getChildByName("pic").getComponent(cc.Sprite).spriteFrame = GeneralCommand.getInstance().proxy.getGeneralTex(list[i].cfgId);
            item.parent = this.srollLayout.node;
            item.getComponent(cc.Toggle).cfgData = GeneralCommand.getInstance().proxy.getGeneralCfg(list[i].cfgId);
            item.getComponent(cc.Toggle).curData = list[i];
        }
    }

    protected onClickGeneral(currentTarget:any): void {
        this.dispose(currentTarget);
        currentTarget.isChecked = false;

        var position = this.getIndex(currentTarget.curData);
        ArmyCommand.getInstance().generalDispose(this._cityData.cityId,currentTarget.curData.id,this._orderIndex + 1,position,this._cityData);
    }


    private addDispose(data:any):void{
        var maxSize = 3;
        for(var i = 0;i < maxSize;i++){
            if(!this._generalDisposeArr[i]){
                this._generalDisposeArr[i] = data;
            }
        }
        
    }


    private updateView():void{
        for(var i = 0;i < this.picNode.length;i++){
            var item = this.picNode[i];
            item.getChildByName("pic").active = false;
            item.otherData = null;
            var dispiose = this._generalDisposeArr[i]; 
            if(dispiose){
                item.getChildByName("pic").active = true;
                item.getChildByName("pic").getComponent(cc.Sprite).spriteFrame = GeneralCommand.getInstance().proxy.getGeneralTex(dispiose.cfgId);
                item.otherData = dispiose;
            }
        }
    }
    



    private removeDispose(data:any):void{
        var maxSize = 3;
        for(var i = 0;i < maxSize;i++){
            if(this._generalDisposeArr[i] == data){
                this._generalDisposeArr[i] = null;
            }
        }
    }


    private getIndex(data:any):number{
        var maxSize = 3;
        for(var i = 0;i < maxSize;i++){
            if(this._generalDisposeArr[i] == data){
                return (i + 1);
            }
        }

        return 0;
    }


    protected dispose(currentTarget:any):void{
        if(currentTarget.isChecked){
            this.addDispose(currentTarget.curData);
        }else{
            this.removeDispose(currentTarget.curData);
        }
    }


    protected clearDisPose():void{
        this._generalDisposeArr = [];
        this.updateView();
    }



    protected onClickDisGeneral(event:any): void {
        var otherData = event.currentTarget.otherData;
        if(otherData){
            cc.systemEvent.emit("open_general_conscript", this._orderIndex,this._cityData);
        }
        
    }

    protected onEnable():void{
    }


}
