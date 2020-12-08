// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import UnionCommand from "./UnionCommand";
import { Member, Union } from "./UnionProxy";


const { ccclass, property } = cc._decorator;

@ccclass
export default class UnionMyLogic extends cc.Component {

    @property(cc.ScrollView)
    memberView:cc.ScrollView = null;
    
    @property(cc.ScrollView)
    applyView:cc.ScrollView = null;

    protected _unionData:Union = null;

    protected onLoad():void{
        cc.systemEvent.on("update_union_member",this.updateMember,this);
        cc.systemEvent.on("update_union_apply",this.updateApply,this);
        cc.systemEvent.on("verify_union_success",this.getApply,this);
    }


    protected updateMember(data:any[]){
        var comp = this.memberView.node.getComponent("ListLogic");
        var list:Member[] = UnionCommand.getInstance().proxy.getMemberList(this._unionData.id);
        comp.setData(list);
    }


    protected updateApply(data:any[]){
        var comp = this.applyView.node.getComponent("ListLogic");
        comp.setData(data);
    }


    protected getApply():void{
        UnionCommand.getInstance().unionApplyList(this._unionData.id);
    }

    protected onEnable():void{
    }

    public setData(data:Union):void{
        this._unionData = data;
        UnionCommand.getInstance().unionMember(this._unionData.id);
       this.getApply();
    }


    protected dismiss():void{
        UnionCommand.getInstance().unionDismiss();

    }

}
