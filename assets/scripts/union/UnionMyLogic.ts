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
    scrollView:cc.ScrollView = null;
    

    protected _unionData:Union = null;

    protected onLoad():void{
        cc.systemEvent.on("update_union_member",this.updateMember,this);
    }


    protected updateMember(data:any[]){
        var comp = this.scrollView.node.getComponent("ListLogic");
        var list:Member[] = UnionCommand.getInstance().proxy.getMemberList(this._unionData.id);
        comp.setData(list);
    }



    protected onEnable():void{
    }

    public setData(data:Union):void{
        this._unionData = data;
        UnionCommand.getInstance().unionMember(this._unionData.id);
    }


    protected dismiss():void{
        UnionCommand.getInstance().unionDismiss();

    }

}
