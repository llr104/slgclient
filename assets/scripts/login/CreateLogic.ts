import { _decorator, Component, EditBox, Toggle } from 'cc';
const { ccclass, property } = _decorator;

import { ServerConfig } from "../config/ServerConfig";
import LoginCommand from "./LoginCommand";
import { EventMgr } from '../utils/EventMgr';

@ccclass('CreateLogic')
export default class CreateLogic extends Component {

    @property(EditBox)
    editName: EditBox = null;


    @property(Toggle)
    manToggle: Toggle = null;
    

    @property(Toggle)
    girlToggle: Toggle = null;


    protected onLoad():void{
        EventMgr.on(ServerConfig.role_create, this.create, this);
        this.editName.string = this.getRandomName();
    }

    protected onCreate() {
        var sex = this.manToggle.isChecked?0:1;
        var loginData: any = LoginCommand.getInstance().proxy.getLoginData();
        LoginCommand.getInstance().role_create(loginData.uid, this.editName.string, sex,LoginCommand.getInstance().proxy.serverId, 0)
    }


    protected create(data):void{
        console.log("create:", data);
        if(data.code == 0){
            this.node.active = false;
        }
    }

    protected onRandomName():void{
        this.editName.string = this.getRandomName();
    }


    /*
    *@param Number NameLength 要获取的名字长度
    */
   protected getRandomName():string{
       let name = ""
       var firstname:string[] = ["李","西门","沈","张","上官","司徒","欧阳","轩辕"];
       var nameq:string[] = ["彪","巨昆","锐","翠花","小小","撒撒","熊大","宝强"];
       var xingxing = firstname[Math.floor(Math.random() * (firstname.length))];
       var mingming = nameq[Math.floor(Math.random() * (nameq.length))];
       name = xingxing + mingming;
        return name
    }



    protected onDestroy():void{
        EventMgr.targetOff(this);
    }
}
