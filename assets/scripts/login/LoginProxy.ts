import { NetEvent } from "../network/socket/NetInterface";
import { LoginCommand } from "./LoginCommand";

var HttpConfig = require("HttpConfig");
var ServerConfig = require("ServerConfig");

export class LoginProxy {

    private static _instance: LoginProxy = null;
    private _loginData:any = null;
    public static getInstance(): LoginProxy {
        if (this._instance == null) {
            this._instance = new LoginProxy();
            this._instance.init();
        }
        return this._instance;
    }

    public  init(){
        cc.systemEvent.on(HttpConfig.register.name, this.register, this);
        cc.systemEvent.on(ServerConfig.account_login, this.login, this);
        cc.systemEvent.on(ServerConfig.role_enterServer, this.enter, this);


        cc.systemEvent.on(NetEvent.ServerConnected, this.conneted, this);
        cc.systemEvent.on(ServerConfig.account_reLogin, this.relogin, this);


        cc.systemEvent.on(ServerConfig.role_create, this.create, this);
    }


    private login(data){
        console.log("LoginProxy  login:",data);

        if(data.code == 0){
            this._loginData = data.msg;
            new LoginCommand().role_enterServer(0);
        }

    }

    private register(data,otherData){
        console.log("LoginProxy  register:",data,otherData);
        if(data.code == 0){
            new LoginCommand().accountLogin(otherData.username,otherData.username);
        }
    }

    private enter(data){
        console.log("LoginProxy  enter:",data);

        //没有创建打开创建
        if(data.code == 9){
            cc.systemEvent.emit("create");
        }else{
            //进入游戏
        }
    }


    private relogin(data){
        //断线重新登录
        console.log("LoginProxy  relogin:",data);
    }

    public getLoginData(){
        return this._loginData;
    }


    private conneted(){
        //连接成功
        var loginData = this.getLoginData();
        console.log("LoginProxy  conneted:",loginData);
        if(loginData){
            new LoginCommand().account_reLogin(loginData.session);
        }
    }


    private create(data){
        //重换成功再次调用
        if(data.code == 0){
            new LoginCommand().role_enterServer(0);
        }
    }

    public clear(){
        this._loginData = null;
    }

    public destory(){
        cc.systemEvent.targetOff(this);
    }
}

module.exports = LoginProxy.getInstance();