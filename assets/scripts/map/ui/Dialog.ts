// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class Dialog extends cc.Component {

    @property(cc.Label)
    label: cc.Label = null;

    protected closeCallBack: Function = null;

    protected onClickClose(): void {
        if (this.closeCallBack){
            this.closeCallBack()
        }

        this.node.active = false;
    }

    public text(text: any): void {
       this.label.string = text
    }

    public setClose(close :Function){
        this.closeCallBack = close
    }

}
