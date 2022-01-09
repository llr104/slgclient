

import { _decorator, Component, ScrollView, Node, Prefab, instantiate, UITransform, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

import GeneralCommand from "../../general/GeneralCommand";
import GeneralItemLogic, { GeneralItemType } from "./GeneralItemLogic";
import { EventMgr } from '../../utils/EventMgr';

@ccclass('GeneralConvertLogic')
export default class GeneralConvertLogic extends Component {

    @property(ScrollView)
    scrollView:ScrollView = null;

    @property(Node)
    contentNode:Node = null;

    @property(Prefab)
    generalPrefab = null;

    private _cunGeneral:number[] = [];

    private _upMap:Map<number, Node> = new Map<number, Node>();

    private _selectMap:Map<number, Node> = new Map<number, Node>();

    protected onEnable():void{
       this.initGeneralCfg();
       EventMgr.on("open_general_select", this.onSelectGeneral, this);
       EventMgr.on("general_convert", this.onGeneralConvert, this);
    }


    protected onDisable():void{
        EventMgr.targetOff(this);
    }

    protected onClickClose(): void {
        this.node.active = false;
        EventMgr.emit("open_general");
    }

    protected initGeneralCfg():void{

        let list:any[] = GeneralCommand.getInstance().proxy.getMyGeneralsNotUse();
        let listTemp = list.concat();

        listTemp.forEach(item => {
            item.type = GeneralItemType.GeneralSelect;
        })


        for(var i = 0; i < listTemp.length ;i++){
            if(this._cunGeneral.indexOf(listTemp[i].id) >= 0 ){
                listTemp.splice(i,1);
                i--;
            }
        }

        var comp = this.scrollView.node.getComponent("ListLogic");
        comp.setData(listTemp);
    }

    protected onSelectGeneral(cfgData: any, curData: any, node:Node): void {
        //console.log("curData:", curData, this._upMap.size);

        var has = this._upMap.has(curData.id);
        if (has){
            var obj = this._upMap.get(curData.id);
            obj.parent = null;
            this._upMap.delete(curData.id);

            var g = this._selectMap.get(curData.id);
            if (g){
                g.getComponent(GeneralItemLogic).select(false);
            }

        }else{

            if (this._upMap.size >= 9){
                node.getComponent(GeneralItemLogic).select(false);
                return
            }

            var g:Node = instantiate(this.generalPrefab);
            g.getComponent(GeneralItemLogic).setData(curData,  GeneralItemType.GeneralSelect);
            g.getComponent(GeneralItemLogic).select(true);
            g.getComponent(UITransform).width *=0.5;
            g.getComponent(UITransform).height*=0.5;
            g.scale = new Vec3(0.5, 0.5, 0.5);
            g.parent = this.contentNode;
            this._upMap.set(curData.id, g);
            this._selectMap.set(curData.id, node);
        }
    }

   
    protected onGeneralConvert(msg:any):void{
        EventMgr.emit("show_toast", "获得金币:"+msg.add_gold);
        this._upMap.forEach((g:Node) => {
            g.parent = null;
        });

        this._upMap.clear();
        this._selectMap.clear();

        this.initGeneralCfg();
    }

    protected onClickOK():void{
        var keys = this._upMap.keys();
        var ids = Array.from(keys);
        GeneralCommand.getInstance().convert(ids);
    }
    

}
