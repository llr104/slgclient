import { _decorator, Component, Label } from 'cc';
const { ccclass, property } = _decorator;
import UnionCommand from "./UnionCommand";
import { Apply } from "./UnionProxy";

@ccclass('UnionApplyItemLogic')
export default class UnionApplyItemLogic extends Component {
    @property(Label)
    nameLabel: Label | null = null;
    protected _applyData:Apply = null;
    protected onLoad():void{

    }
    protected updateItem(data:Apply):void{
        this._applyData = data;
        this.nameLabel.string = this._applyData.nick_name;
    }
    protected verify(event:any,decide:number = 0):void{
        UnionCommand.getInstance().unionVerify(this._applyData.id,Number(decide));
    }
}

