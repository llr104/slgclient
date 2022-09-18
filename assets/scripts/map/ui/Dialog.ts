
import { _decorator, Component, Label, Button, Node, tween, Vec3 } from 'cc';
import { AudioManager } from '../../common/AudioManager';
const {ccclass, property} = _decorator;

export class DialogType {
    public static Default:number = 0;
    public static OnlyCancel:number = 1;
    public static OnlyConfirm:number = 2;
}

@ccclass('Dialog')
export default class Dialog extends Component {

    @property(Label)
    text: Label = null;

    @property(Button)
    confirmBtn: Button = null;

    @property(Button)
    cancelBtn: Button = null;

    protected closeCB: Function = null;
    protected confirmCB: Function = null;
    protected cancelCB: Function = null;


    protected close(): void {
        if (this.closeCB){
            this.closeCB()
        }
        this.node.active = false;
    }

    public show(text: string, type: number): void {

        

       this.text.string = text;
       if(type == DialogType.Default){
            this.confirmBtn.node.active = true;
            this.cancelBtn.node.active = true;
       }else if(type == DialogType.OnlyCancel){
            this.confirmBtn.node.active = false;
            this.cancelBtn.node.active = true;
       }else if(type == DialogType.OnlyConfirm){
            this.confirmBtn.node.active = true;
            this.cancelBtn.node.active = false;
        }
    }

    public setClose(cb :Function){
        this.closeCB = cb;
    }

    public setConfirmCB(cb :Function) {
        this.confirmCB = cb;
    }

    public setCancelCB(cb :Function) {
        this.cancelCB = cb;
    }

    protected clickConfirm(){
        AudioManager.instance.playClick();
        if(this.confirmCB){
            this.confirmCB();
        }

        this.close();
    }

    protected clickCancel(){
        AudioManager.instance.playClick();
        if(this.cancelCB){
            this.cancelCB();
        }
        this.close();
    }

}
