// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import LoginCommand from "../../login/LoginCommand";
import MapCommand from "../MapCommand";
import MapUICommand from "./MapUICommand";


const { ccclass, property } = cc._decorator;

@ccclass
export default class GeneralLogic extends cc.Component {


    @property(cc.Node)
    generalNode: cc.Node = null;

    @property(cc.Layout)
    srollLayout:cc.Layout = null;


    protected onLoad():void{
        cc.systemEvent.on("onQryMyGenerals", this.initGeneralCfg, this);
    }


    protected onDestroy():void{
        cc.systemEvent.targetOff(this);
    }

    protected onClickClose(): void {
        this.node.active = false;
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
            item.cfgData = _generalConfigArr[i];
            item.curData = curData;
        }

    }


    protected onClickGeneral(event:any): void {
        var cfgData = event.currentTarget.cfgData;
        var curData = event.currentTarget.curData;
        cc.systemEvent.emit("open_general_des",cfgData,curData);
    }


    protected onEnable():void{
        this.initGeneralCfg();
        MapUICommand.getInstance().qryMyGenerals();
    }


}
