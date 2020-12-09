// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { ArmyData } from "../../general/ArmyProxy";
import GeneralCommand from "../../general/GeneralCommand";
import { GeneralCommonConfig } from "../../general/GeneralProxy";
import LoginCommand from "../../login/LoginCommand";
import { GeneralItemType } from "./GeneralItemLogic";


const { ccclass, property } = cc._decorator;

@ccclass
export default class DrawRLogic extends cc.Component {


    @property(cc.Prefab)
    generalItemPrefab: cc.Prefab = null;

    @property(cc.Layout)
    tenLayout:cc.Layout = null;

    @property(cc.Layout)
    oneLayout:cc.Layout = null;

    private _maxSize:number = 10;
    private _scale:number = 0.4;

    protected onLoad():void{

        for(var i = 0; i < this._maxSize;i++){
            let _generalNode = cc.instantiate(this.generalItemPrefab);
            _generalNode.parent = this.tenLayout.node;
            _generalNode.scale = this._scale;
            _generalNode.active = false;
        }


        let _generalNode = cc.instantiate(this.generalItemPrefab);
        _generalNode.parent = this.oneLayout.node;
        _generalNode.scale = this._scale
        _generalNode.active = false;

    }



    public setData(data:any):void{
        this.tenLayout.node.active = this.oneLayout.node.active = false;
        if(data.length == 1){
            this.oneLayout.node.active = true;
            var children = this.oneLayout.node.children;
            let com = children[0].getComponent("GeneralItemLogic");
            children[0].active = true;
            if(com){
                com.setData(data[0],GeneralItemType.GeneralNoThing);
            }

        }else{
            this.tenLayout.node.active = true;
            var children = this.tenLayout.node.children;
            for(var i = 0; i < this._maxSize;i++){
                var child = children[i];
                if(data[i]){
                    child.active = true;
                    let com = child.getComponent("GeneralItemLogic");
                    if(com){
                        com.setData(data[i],GeneralItemType.GeneralNoThing);
                    }
                }
                else{
                    child.active = false;
                }
            }
        }

    }

    protected onDestroy():void{
        cc.systemEvent.targetOff(this);
    }

    protected onClickClose(): void {
        this.node.active = false;
    }





}
