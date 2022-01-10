import { _decorator, Component, Sprite, SpriteFrame, resources } from 'cc';
const {ccclass} = _decorator;
import GeneralCommand from "../../general/GeneralCommand";

@ccclass('GeneralHeadLogic')
export default class GeneralHeadLogic extends Component {
    
    public setHeadId(id:number) {

        // console.log("setHeadId:", id);
        var frame = GeneralCommand.getInstance().proxy.getGeneralTex(id);
        if(frame){
            var sp = this.node.getComponent(Sprite);
            if(sp){
                sp.spriteFrame = frame;
            }
        }else{

            console.log("load setHeadId:", id);
            resources.load("./generalpic/card_" + id + "/spriteFrame", SpriteFrame, 
                (finish: number, total: number) => {
                },
                (error: Error, asset: any) => {
                    if (error != null) {
                        console.log("setHeadId error:", error.message);
                    }else{
                        var frame = asset as SpriteFrame;
                        var sp = this.node.getComponent(Sprite);
                        if(sp){
                            sp.spriteFrame = frame;
                        }

                        GeneralCommand.getInstance().proxy.setGeneralTex(id, frame);
                    }
                });

        }
    }
}
