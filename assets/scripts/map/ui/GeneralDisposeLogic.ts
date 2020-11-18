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


    protected onLoad():void{
        cc.systemEvent.on("onQryMyGenerals", this.initGeneralCfg, this);
        cc.systemEvent.on(ServerConfig.general_dispose, this.onGeneralDispose, this);
    }


    private onGeneralDispose(data:any):void{
        console.log("onGeneralDispose:",data)
    }

    protected onDestroy():void{
        cc.systemEvent.targetOff(this);
    }

    protected onClickClose(): void {
        this.node.active = false;
    }


    public setData(data:any):void{
        this._cityData = data;
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

    }


    protected onClickGeneral(currentTarget:any): void {
        // var cfgData = event.currentTarget.cfgData;
        // var curData = event.currentTarget.curData;

        console.log("currentTarget:",currentTarget)

        if(currentTarget.isChecked){
            this.addDispose(currentTarget.curData);
        }else{
            this.removeDispose(currentTarget.curData);
        }

        this.upDateView();

        var index = this._generalDisposeArr.indexOf(currentTarget.curData);
        index+=1;
        MapUICommand.getInstance().generalDispose(this._cityData.cityId,currentTarget.curData.id,1,index);
    }


    private addDispose(data:any):void{
        var maxSize = 3;
        if(this._generalDisposeArr.length >= maxSize){
            return;
        }
        this._generalDisposeArr.push(data);
    }


    private upDateView():void{
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
        var index = this._generalDisposeArr.indexOf(data);
        if(index >= 0){
            this._generalDisposeArr.splice(index,1);
        }
    }

    protected onEnable():void{
        this.initGeneralCfg();
        MapUICommand.getInstance().qryMyGenerals();
    }


}
