// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { ServerConfig } from "../../config/ServerConfig";
import LoginCommand from "../../login/LoginCommand";
import MapCommand from "../MapCommand";
import MapUICommand from "./MapUICommand";


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
        cc.systemEvent.on("onQryMyGenerals", this.initGeneralCfg, this);
        cc.systemEvent.on("onGeneralArmyList", this.onGeneralArmyList, this);
        cc.systemEvent.on("onGeneralDispose", this.onGeneralArmyList, this);
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
        MapUICommand.getInstance().qryMyGenerals();
    }


    protected onGeneralArmyList():void{
        this.clearDisPose();

        var cityArmy = MapUICommand.getInstance().proxy.getCityArmy(this._cityData.cityId);
        // console.log("cityArmy:",cityArmy)
        var cityArmyData = cityArmy[this._orderIndex];
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

        this.updateView();
    }


    protected initGeneralCfg():void{
        var _generalConfig = MapUICommand.getInstance().proxy.getGeneralCfg();
        this.srollLayout.node.removeAllChildren();

        let _generalConfigArr = Array.from(_generalConfig.values());

        for(var i = 0;i < _generalConfigArr.length; i++){
            var cfgId = _generalConfigArr[i].cfgId;

            var curData = MapUICommand.getInstance().proxy.getMyGeneral(cfgId);
            if(!curData){
                continue;
            }

            var item = cc.instantiate(this.generalNode);
            item.active = true;

            
            item.getChildByName("name").getComponent(cc.Label).string = _generalConfigArr[i].name;
            item.getChildByName("pic").getComponent(cc.Sprite).spriteFrame = MapUICommand.getInstance().proxy.getGenTex(cfgId);
            item.parent = this.srollLayout.node;
            item.getComponent(cc.Toggle).cfgData = _generalConfigArr[i];
            item.getComponent(cc.Toggle).curData = curData;
        }


        MapUICommand.getInstance().qryGeneralArmyList(this._cityData.cityId);
    }


    protected onClickGeneral(currentTarget:any): void {
        this.dispose(currentTarget);
        currentTarget.isChecked = false;

        var position = this.getIndex(currentTarget.curData);
        MapUICommand.getInstance().generalDispose(this._cityData.cityId,currentTarget.curData.id,this._orderIndex + 1,position,this._cityData);
    }


    private addDispose(data:any):void{
        var maxSize = 3;
        // if(this._generalDisposeArr.length >= maxSize){
        //     return;
        // }

        // if(this._generalDisposeArr.indexOf(data) ==  -1){
        //     this._generalDisposeArr.push(data);
        // }

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

            var dispiose = this._generalDisposeArr[i]; 
            if(dispiose){
                item.getChildByName("pic").active = true;
                item.getChildByName("pic").getComponent(cc.Sprite).spriteFrame = MapUICommand.getInstance().proxy.getGenTex(dispiose.cfgId);
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

    protected onEnable():void{
    }


}
