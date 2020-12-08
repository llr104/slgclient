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
export default class UnionLobbyLogic extends cc.Component {

    @property(cc.ScrollView)
    scrollView:cc.ScrollView = null;

    protected onLoad():void{
        cc.systemEvent.on("update_union_list",this.updateUnion,this);
    }


    protected updateUnion(data:any[]){
        var comp = this.scrollView.node.getComponent("ListLogic");
        var list:Union[] = UnionCommand.getInstance().proxy.getUnionList();
        comp.setData(list);
    }


    protected onClickClose(): void {
        this.node.active = false;
    }

    protected onEnable():void{
        UnionCommand.getInstance().unionList();
    }
}
