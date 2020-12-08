// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import LoginCommand from "../login/LoginCommand";
import { Role } from "../login/LoginProxy";
import UnionCommand from "./UnionCommand";
import { Union } from "./UnionProxy";


const { ccclass, property } = cc._decorator;

@ccclass
export default class UnionItemLogic extends cc.Component {


    @property(cc.Label)
    nameLabel: cc.Label = null;


    @property(cc.Node)
    joinButtonNode: cc.Node = null;

    protected _unionData:Union = null;

    protected onLoad():void{
        this.joinButtonNode.active = false;
    }

    protected updateItem(data:Union):void{
        this._unionData = data;
        this.nameLabel.string = this._unionData.name;
        this.joinButtonNode.active = this.isCanJoin();


    }

    protected isCanJoin():boolean{
        var roleData:Role = LoginCommand.getInstance().proxy.getRoleData();
        for(var i = 0; i < this._unionData.major.length;i++){
            if(this._unionData.major[i].rid == roleData.rid){
                return false;
            }
        }

        return true;
    }

    protected join():void{
        UnionCommand.getInstance().unionJoin(this._unionData.id)
    }

    protected click():void{
        var isCanjoin:boolean = this.isCanJoin();
        if(!isCanjoin){
            cc.systemEvent.emit("open_my_union",this._unionData)
        }
    }

}
