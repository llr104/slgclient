import { _decorator, Component, Label, Prefab, Node, ScrollView, instantiate } from 'cc';
const { ccclass, property } = _decorator;

import GeneralCommand from "../../general/GeneralCommand";
import { GeneralConfig, GeneralData } from "../../general/GeneralProxy";
import { GeneralItemType } from "./GeneralItemLogic";
import { EventMgr } from '../../utils/EventMgr';

@ccclass('GeneralComposeLogic')
export default class GeneralComposeLogic  extends Component {

    @property(Label)
    nameLab: Label = null;

    @property(Prefab)
    generalItemPrefab: Prefab = null;

    @property(Node)
    generalItemParent: Node = null;


    @property(ScrollView)
    scrollView:ScrollView = null;

    @property(Node)
    composeNode: Node = null;

    private _currData:GeneralData = null;
    private _cfgData:GeneralConfig = null;

    private _generalNode:Node = null;
    private _gIdsArr:number[] = [];

    protected onLoad():void{
        this._generalNode = instantiate(this.generalItemPrefab);
        this._generalNode.parent = this.generalItemParent;
    }

    protected onEnable():void{
        EventMgr.on("open_general_select", this.selectItem, this); 
        this.updataView();
    }

    protected onDisable():void{
        EventMgr.targetOff(this);
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

    public setData(cfgData:any,curData:any):void{
        this._currData = curData;
        this._cfgData = cfgData;
        this._gIdsArr = [];
        var com = this._generalNode.getComponent("GeneralItemLogic");
        if(com){
            com.updateItem(this._currData,GeneralItemType.GeneralNoThing);
        }

        this.nameLab.string = this._cfgData.name;
        
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
        this.composeNode.active = ((this._gIdsArr.length > 0) && (this._currData.star_lv < this._cfgData.star));
    }


    protected onCompose(): void {
        GeneralCommand.getInstance().composeGeneral(this._currData.id,this._gIdsArr);
    }

}
