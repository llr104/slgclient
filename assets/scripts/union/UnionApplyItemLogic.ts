// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import LoginCommand from "../login/LoginCommand";
import { Role } from "../login/LoginProxy";
import UnionCommand from "./UnionCommand";
import { Apply, Member, Union } from "./UnionProxy";


const { ccclass, property } = cc._decorator;

@ccclass
export default class UnionApplyItemLogic extends cc.Component {


    @property(cc.Label)
    nameLabel: cc.Label = null;

    protected _applyData:Apply = null;

    protected onLoad():void{
        
    }

    protected updateItem(data:Apply):void{
        this._applyData = data;
    }



    protected verify(event:any,decide:number = 0):void{
        UnionCommand.getInstance().unionVerify(this._applyData.id,decide);
    }

}
