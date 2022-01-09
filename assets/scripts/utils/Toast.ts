import { _decorator, Component, Label } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Toast')
export default class Toast extends Component {
    @property(Label)
    msgLabel: Label | null = null;
    protected onRemove():void{
        this.node.active = false;
    }
    public setText(text:string):void{
        this.unschedule(this.onRemove);
        this.schedule(this.onRemove, 2);
        this.msgLabel.string = text;
    }
}
