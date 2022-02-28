// // Learn TypeScript:
// //  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// // Learn Attribute:
// //  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// // Learn life-cycle callbacks:
// //  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { _decorator, Component, Label } from 'cc';
import { AudioManager } from '../../common/AudioManager';
const {ccclass, property} = _decorator;

@ccclass('Dialog')
export default class Dialog extends Component {

    @property(Label)
    label: Label = null;

    protected closeCallBack: Function = null;

    protected onClickClose(): void {
        if (this.closeCallBack){
            this.closeCallBack()
        }
        AudioManager.instance.playClick();
        this.node.active = false;
    }

    public text(text: any): void {
       this.label.string = text
    }

    public setClose(close :Function){
        this.closeCallBack = close
    }

}
