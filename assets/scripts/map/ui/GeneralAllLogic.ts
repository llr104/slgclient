// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import GeneralCommand from "../../general/GeneralCommand";
import { GenaralLevelConfig } from "../../general/GeneralProxy";
import { GeneralItemType } from "./GeneralItemLogic";


const { ccclass, property } = cc._decorator;

@ccclass
export default class GeneralAllLogic  extends cc.Component {


    @property(cc.Prefab)
    generalDesPrefab: cc.Prefab = null;

    @property(cc.Prefab)
    generalComposePrefab: cc.Prefab = null;


    @property(cc.Prefab)
    generalAddPrefab: cc.Prefab = null;


    @property(cc.ToggleContainer)
    generalToggleContainer: cc.ToggleContainer = null;

    
    private _currData:any = null;
    private _cfgData:any = null;

    private _curIndex:number = 0;
    private _nodeList:cc.Node[] = [];

    protected onLoad():void{
        cc.systemEvent.on("update_one_generals", this.updateOnce, this); 

        var des = cc.instantiate(this.generalDesPrefab);
        des.parent = this.node;
        des.active = false;


        var comp = cc.instantiate(this.generalComposePrefab);
        comp.parent = this.node;
        comp.active = false;


        var addd = cc.instantiate(this.generalAddPrefab);
        addd.parent = this.node;
        addd.active = false;

        this._nodeList[0] = des;
        this._nodeList[1] = comp;
        this._nodeList[2] = addd;
    }

    protected updateOnce(curData:any):void{
        this.setData(this._cfgData,curData)
    }
   

    protected onDestroy():void{
        this._nodeList = []
        cc.systemEvent.targetOff(this);
    }

    protected onClickClose(): void {
        this.node.active = false;
    }



    public setData(cfgData:any,curData:any):void{
        this._currData = curData;
        this._cfgData = cfgData;
        this.setIndex(this._curIndex);
    }

    protected setIndex(index:number = 0):void{
        this._curIndex = index;
        this.allVisible();
        this._nodeList[index].active = true;
        this.generalToggleContainer.toggleItems[index].isChecked = true;

        let logicNameArr:string[] = ["GeneralDesLogic","GeneralComposeLogic","GeneralAddPrLogic"]
        let com = this._nodeList[index].getComponent(logicNameArr[index]);
        if(com){
            com.setData(this._cfgData,this._currData);
        }
    }


    protected allVisible():void{
        for(var i = 0; i < this._nodeList.length; i++){
            this._nodeList[i].active = false;
        }
    }

    protected selectHandle(event:any,other:any):void{
        // console.log("event:",event,other)
        this.setIndex(other)
    }


}
