// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import GeneralCommand from "../../general/GeneralCommand";
import { GeneralData } from "../../general/GeneralProxy";


const { ccclass, property } = cc._decorator;

@ccclass
export default class GeneralLogic extends cc.Component {


    @property(cc.Node)
    generalNode: cc.Node = null;

    @property(cc.Layout)
    srollLayout:cc.Layout = null;


    protected onLoad():void{
        cc.systemEvent.on("update_my_generals", this.initGeneralCfg, this);
    }


    protected onDestroy():void{
        cc.systemEvent.targetOff(this);
    }

    protected onClickClose(): void {
        this.node.active = false;
    }



    protected initGeneralCfg():void{
        let list:GeneralData[] = GeneralCommand.getInstance().proxy.getMyGenerals();
        console.log("initGeneralCfg", list, this.srollLayout.node);
        this.srollLayout.node.removeAllChildren(true);
        for (let i:number = 0; i < list.length; i++) {
            let item:cc.Node = cc.instantiate(this.generalNode);
            item.active = true;
            item.getChildByName("name").getComponent(cc.Label).string = list[i].name;
            item.getChildByName("pic").getComponent(cc.Sprite).spriteFrame = GeneralCommand.getInstance().proxy.getGeneralTex(list[i].cfgId);
            item.parent = this.srollLayout.node;
            item.cfgData = GeneralCommand.getInstance().proxy.getGeneralCfg(list[i].cfgId);
            item.curData = list[i];
        }
    }


    protected onClickGeneral(event:any): void {
        var cfgData = event.currentTarget.cfgData;
        var curData = event.currentTarget.curData;
        cc.systemEvent.emit("open_general_des",cfgData,curData);
    }


    protected onEnable():void{
        this.initGeneralCfg();
        GeneralCommand.getInstance().qryMyGenerals();
    }


}
