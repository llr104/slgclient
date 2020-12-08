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
    layout:cc.Layout = null;

    private _maxSize:number = 10;

    protected onLoad():void{

        for(var i = 0; i < this._maxSize;i++){
            let _generalNode = cc.instantiate(this.generalItemPrefab);
            _generalNode.parent = this.layout.node;
            _generalNode.scale = 0.4;
            _generalNode.active = false;

        }

    }


    public setData(data:any):void{
        var children = this.layout.node.children;

        this.layout.node.width = 800;
        this.layout.node.height = 500;
        this.layout.spacingX = this.layout.spacingY = 10;
        this.layout.resizeMode = cc.Layout.ResizeMode.CONTAINER;
        if(data.length == 1){
            this.layout.type = cc.Layout.Type.HORIZONTAL
        }else{
            this.layout.type = cc.Layout.Type.GRID;
        }
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

    protected onDestroy():void{
        cc.systemEvent.targetOff(this);
    }

    protected onClickClose(): void {
        this.node.active = false;
    }





}
