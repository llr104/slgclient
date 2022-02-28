import { _decorator, Component, EditBox, Toggle } from 'cc';
const { ccclass, property } = _decorator;

import { ServerConfig } from "../config/ServerConfig";
import LoginCommand from "./LoginCommand";
import { EventMgr } from '../utils/EventMgr';
import { createName } from '../libs/NameDict';
import { AudioManager } from '../common/AudioManager';

@ccclass('CreateLogic')
export default class CreateLogic extends Component {

    @property(EditBox)
    editName: EditBox = null;


    @property(Toggle)
    manToggle: Toggle = null;
    

    protected onLoad():void{
        EventMgr.on(ServerConfig.role_create, this.create, this);
        this.editName.string = this.getRandomName();
    }

    protected onClickCreate() {
        AudioManager.instance.playClick();
        var sex = this.manToggle.isChecked?0:1;
        var loginData: any = LoginCommand.getInstance().proxy.getLoginData();
        LoginCommand.getInstance().role_create(loginData.uid, this.editName.string, sex,LoginCommand.getInstance().proxy.serverId, 0)
    }

    protected onClickToggle () {
        AudioManager.instance.playClick();
    }


    protected create(data):void{
        console.log("create:", data);
        if(data.code == 0){
            this.node.active = false;
        }
    }

    protected onRandomName():void{
        AudioManager.instance.playClick();
        this.editName.string = this.getRandomName();
    }



   protected getRandomName():string{
        var sex = this.manToggle.isChecked ? "boy" : "girl";
        let name = createName(sex);
        return name
    }



    protected onDestroy():void{
        EventMgr.targetOff(this);
    }
}
