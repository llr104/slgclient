import { _decorator, Component, Label } from 'cc';
import { AudioManager } from '../common/AudioManager';
const { ccclass, property } = _decorator;
import UnionCommand from "./UnionCommand";
import { Apply } from "./UnionProxy";

@ccclass('UnionApplyItemLogic')
export default class UnionApplyItemLogic extends Component {
    @property(Label)
    nameLabel: Label | null = null;
    protected _applyData:Apply = null;

    protected updateItem(data:Apply):void{
        this._applyData = data;
        this.nameLabel.string = this._applyData.nick_name;
    }
    protected verify(event:any,decide:number = 0):void{
        AudioManager.instance.playClick();
        UnionCommand.getInstance().unionVerify(this._applyData.id,Number(decide));
    }
}

