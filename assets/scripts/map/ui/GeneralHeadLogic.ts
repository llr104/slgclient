// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import LoaderManager, { LoadData, LoadDataType } from "../../core/LoaderManager";
import GeneralCommand from "../../general/GeneralCommand";

const {ccclass, property} = cc._decorator;

@ccclass
export default class GeneralHeadLogic extends cc.Component {
    
    public setHeadId(id:number) {

        // console.log("setHeadId:", id);
        var frame = GeneralCommand.getInstance().proxy.getGeneralTex(id);
        if(frame){
            var sp = this.node.getComponent(cc.Sprite);
            if(sp){
                sp.spriteFrame = frame;
            }
        }else{

            console.log("load setHeadId:", id);
            cc.resources.load("./generalpic/card_" + id, cc.SpriteFrame, 
                (finish: number, total: number) => {
                },
                (error: Error, asset: any) => {
                    if (error != null) {
                        console.log("setHeadId error:", error.message);
                    }else{
                        var frame = asset as cc.SpriteFrame;
                        var sp = this.node.getComponent(cc.Sprite);
                        if(sp){
                            sp.spriteFrame = frame;
                        }

                        GeneralCommand.getInstance().proxy.setGeneralTex(id, frame);
                    }
                });

        }
    }
}
