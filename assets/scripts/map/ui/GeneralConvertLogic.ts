// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html


import GeneralCommand from "../../general/GeneralCommand";
import GeneralItemLogic, { GeneralItemType } from "./GeneralItemLogic";


const { ccclass, property } = cc._decorator;

@ccclass
export default class GeneralConvertLogic extends cc.Component {

    @property(cc.ScrollView)
    scrollView:cc.ScrollView = null;

    @property(cc.Node)
    contentNode:cc.Node = null;

    @property(cc.Prefab)
    generalPrefab = null;

    private _cunGeneral:number[] = [];

    private _upMap:Map<number, cc.Node> = new Map<number, cc.Node>();

    private _selectMap:Map<number, cc.Node> = new Map<number, cc.Node>();

    protected onEnable():void{
       this.initGeneralCfg();
       cc.systemEvent.on("open_general_select", this.onSelectGeneral, this);
       cc.systemEvent.on("general_convert", this.onGeneralConvert, this);
    }


    protected onDisable():void{
        cc.systemEvent.targetOff(this);
    }

    protected onClickClose(): void {
        this.node.active = false;
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

    protected onSelectGeneral(cfgData: any, curData: any, node:cc.Node): void {
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

            var g:cc.Node = cc.instantiate(this.generalPrefab);
            g.getComponent(GeneralItemLogic).setData(curData,  GeneralItemType.GeneralSelect);
            g.getComponent(GeneralItemLogic).select(true);
            g.width*=0.5;
            g.height*=0.5;
            g.scale = 0.5;
            g.parent = this.contentNode;
            this._upMap.set(curData.id, g);
            this._selectMap.set(curData.id, node);
        }
    }

   
    protected onGeneralConvert(msg:any):void{
        cc.systemEvent.emit("show_toast", "获得金币:"+msg.add_gold);
        this._upMap.forEach((g:cc.Node) => {
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
