// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import GeneralCommand from "../../general/GeneralCommand";
import { GeneralConfig, GeneralData } from "../../general/GeneralProxy";
import { GeneralItemType } from "./GeneralItemLogic";

const { ccclass, property } = cc._decorator;

@ccclass
export default class GeneralComposeLogic  extends cc.Component {


    @property(cc.Prefab)
    generalItemPrefab: cc.Prefab = null;

    @property(cc.Node)
    generalItemParent: cc.Node = null;


    @property(cc.ScrollView)
    scrollView:cc.ScrollView = null;

    @property(cc.Node)
    composeNode: cc.Node = null;

    private _currData:GeneralData = null;
    private _cfgData:GeneralConfig = null;

    private _generalNode:cc.Node = null;
    private _gIdsArr:number[] = [];

    protected onLoad():void{
        this._generalNode = cc.instantiate(this.generalItemPrefab);
        this._generalNode.parent = this.generalItemParent;
        cc.systemEvent.on("open_general_select", this.selectItem, this); 
        cc.systemEvent.on("update_one_generals", this.updateOnce, this); 
        this.updataView();
    
    }


    protected updateOnce(curData:any):void{
        this.setData(this._cfgData,curData)
    }


    private selectItem(cfg:any,curData:any):void{
        var index = this._gIdsArr.indexOf(curData.id);
        if(index >= 0){

            this._gIdsArr.splice(index,1)
        }else{
            this._gIdsArr.push(curData.id);
        }
        this.updataView();

    }

    protected onDestroy():void{
        cc.systemEvent.targetOff(this);
    }

    protected onClickClose(): void {
        this.node.active = false;
    }



    public setData(cfgData:any,curData:any):void{
        this._currData = curData;
        this._cfgData = cfgData;
        this._gIdsArr = [];
        var com = this._generalNode.getComponent("GeneralItemLogic");
        if(com){
            com.updateItem(this._currData,GeneralItemType.GeneralNoThing);
        }

        this.updateGeneral();
        this.updataView();
    }


    protected updateGeneral():void{
        let list:any[] = GeneralCommand.getInstance().proxy.getComposeGenerals(this._cfgData.cfgId,this._currData.id);
        let listTemp = list.concat();


        listTemp.forEach(item => {
            item.type = GeneralItemType.GeneralSelect;
        })

        var comp = this.scrollView.node.getComponent("ListLogic");
        comp.setData(listTemp);
        
    }


    private updataView():void{
        this.composeNode.active = this._gIdsArr.length > 0?true:false;
    }


    protected onCompose(): void {
        GeneralCommand.getInstance().composeGeneral(this._currData.id,this._gIdsArr);
    }

}
