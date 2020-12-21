// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import LoginCommand from "../login/LoginCommand";
import { Role } from "../login/LoginProxy";
import UnionCommand from "./UnionCommand";
import { Member, Union } from "./UnionProxy";


const { ccclass, property } = cc._decorator;

@ccclass
export default class UnionMemItemLogic extends cc.Component {

    @property(cc.Label)
    nameLabel: cc.Label = null;

    @property(cc.Label)
    titleLabel: cc.Label = null;

    @property(cc.Label)
    posLabel: cc.Label = null;

    protected _menberData:Member = null;

    protected onLoad():void{
    }

    protected updateItem(data:Member):void{
        this._menberData = data;
        this.titleLabel.string = "(" + this._menberData.titleDes + ")";
        this.nameLabel.string = this._menberData.name;
        this.posLabel.string = "坐标:(" + this._menberData.x + "," + this._menberData.y+")";
    }

    protected click():void{
        cc.systemEvent.emit("clickUnionMemberItem", this._menberData);
    }

    protected kick():void{
        UnionCommand.getInstance().unionKick(this._menberData.rid);
    }

    
    protected appoint():void{
        UnionCommand.getInstance().unionKick(this._menberData.rid);
    }

    protected abdicate():void{
        UnionCommand.getInstance().unionKick(this._menberData.rid);
    }
    
    protected jump():void{
        cc.systemEvent.emit("close_union");
        cc.systemEvent.emit("scroll_to_map", this._menberData.x, this._menberData.y);
    }

}
