// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import UnionCommand from "./UnionCommand";
import { Union } from "./UnionProxy";


const { ccclass, property } = cc._decorator;

@ccclass
export default class UnionItemLogic extends cc.Component {


    @property(cc.Label)
    nameLabel: cc.Label = null;

    protected onLoad():void{
        
    }

    protected updateItem(data:Union):void{
        this.nameLabel.string = data.name;
    }

}
