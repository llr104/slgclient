import { _decorator, Component, EditBox, Label } from 'cc';
const { ccclass, property } = _decorator;

import { LocalCache } from "../utils/LocalCache";
import LoginCommand from "./LoginCommand";
import { EventMgr } from '../utils/EventMgr';

@ccclass('LoginLogic')
export default class LoginLogic extends Component {

    @property(EditBox)
    editName:EditBox = null;

    @property(EditBox)
    editPass:Label = null;

    protected onLoad(): void {
        EventMgr.on("loginComplete", this.onLoginComplete, this);

        var data = LocalCache.getLoginValidation();
        console.log("LoginLogic  data:",data)
        if(data){
            this.editName.string = data.username;
            this.editPass.string = data.password;
        }
    }

    protected onDestroy(): void {
        EventMgr.targetOff(this);
    }

    protected onLoginComplete():void {
        this.node.active = false;
    }

    protected onClickRegister(): void {
        LoginCommand.getInstance().register(this.editName.string, this.editPass.string);
    }

    protected onClickLogin(): void {
        LoginCommand.getInstance().accountLogin(this.editName.string, this.editPass.string)
    }

    protected onClickClose(): void {
        this.node.active = false;
    }
}
