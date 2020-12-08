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


    @property(cc.Node)
    disMissButton: cc.Node = null;

    @property(cc.Node)
    exitButton: cc.Node = null;

    protected _unionData:Union = null;

    protected onLoad():void{
        cc.systemEvent.on("update_union_member",this.updateMember,this);
        cc.systemEvent.on("update_union_apply",this.updateApply,this);
        
        cc.systemEvent.on("verify_union_success",this.getApply,this);
        cc.systemEvent.on("kick_union_success",this.getMember,this);
    }


    protected updateMember(data:any[]){
        var comp = this.memberView.node.getComponent("ListLogic");
        var list:Member[] = UnionCommand.getInstance().proxy.getMemberList(this._unionData.id).concat();




        list.forEach(item => {
            item.isMeChairMan = UnionCommand.getInstance().proxy.isMeChairman(this._unionData.id)
        })

        comp.setData(list);
    }


    protected updateApply(data:any[]){
        var comp = this.applyView.node.getComponent("ListLogic");
        comp.setData(data?data:[]);
    }


    protected getApply():void{
        var isMe:boolean = UnionCommand.getInstance().proxy.isMeChairman(this._unionData.id);
        if(isMe){
            UnionCommand.getInstance().unionApplyList(this._unionData.id);
        }
        
    }


    protected getMember():void{
        UnionCommand.getInstance().unionMember(this._unionData.id);
    }

    protected onEnable():void{
    }

    public setData(data:Union):void{
        this._unionData = data;
        this.getMember();
       this.getApply();
       this.disMissButton.active = UnionCommand.getInstance().proxy.isMeChairman(this._unionData.id);
       this.exitButton.active = !this.disMissButton.active;
    }


    protected dismiss():void{
        UnionCommand.getInstance().unionDismiss();
    }

    protected exit():void{
        UnionCommand.getInstance().unionExit();
    }

}
