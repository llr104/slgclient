import { HttpConfig } from "../config/HttpConfig";
import { ServerConfig } from "../config/ServerConfig";
import { NetEvent } from "../network/socket/NetInterface";
import LoginCommand from "./LoginCommand";

export default class LoginProxy {

    public loginData: any = null;



    private create(data) {
        //重换成功再次调用
        if (data.code == 0) {
            LoginCommand.getInstance().role_enterServer(0);
        }
    }

    public clear() {
        this.loginData = null;
    }

    public destory() {
        cc.systemEvent.targetOff(this);
    }
}