
import { HttpConfig } from "../config/HttpConfig";
import { ServerConfig } from "../config/ServerConfig";
import { HttpManager } from "../network/http/HttpManager";
import { NetManager } from "../network/socket/NetManager";
import { Tools } from "../utils/Tools";
import CryptoJS = require("../libs/crypto/crypto-js.min");
import LoginProxy from "./LoginProxy";
import { NetEvent } from "../network/socket/NetInterface";
import MapCommand from "../map/MapCommand";
import { LocalCache } from "../utils/LocalCache";
import DateUtil from "../utils/DateUtil";

export default class LoginCommand {
    //单例
    protected static _instance: LoginCommand;
    public static getInstance(): LoginCommand {
        if (this._instance == null) {
            this._instance = new LoginCommand();
        }
        return this._instance;
    }

    public static destory(): boolean {
        if (this._instance) {
            this._instance.onDestory();
            this._instance = null;
            return true;
        }
        return false;
    }

    //数据model
    protected _proxy: LoginProxy = new LoginProxy();

    constructor() {
        cc.systemEvent.on(NetEvent.ServerCheckLogin, this.onServerConneted, this);
        cc.systemEvent.on(HttpConfig.register.name, this.onRegister, this);
        cc.systemEvent.on(ServerConfig.account_login, this.onAccountLogin, this);
        cc.systemEvent.on(ServerConfig.role_enterServer, this.onEnterServer, this);
        cc.systemEvent.on(ServerConfig.account_reLogin, this.onAccountRelogin, this);
        cc.systemEvent.on(ServerConfig.role_create, this.onRoleCreate, this);
        cc.systemEvent.on(ServerConfig.account_logout, this.onAccountLogout, this);
        cc.systemEvent.on(ServerConfig.nationMap_giveUp, this.onNationMapGiveUp, this);

    }

    public onDestory(): void {
        cc.systemEvent.targetOff(this);
    }

    /**注册回调*/
    private onRegister(data: any, otherData: any): void {
        console.log("LoginProxy register:", data, otherData);
        if (data.code == 0) {
            this.accountLogin(otherData.username, otherData.password);
            LocalCache.setLoginValidation(otherData);
        }
    }

    /**登录回调*/
    private onAccountLogin(data: any, otherData:any): void {
        console.log("LoginProxy  login:", data , otherData);
        if (data.code == 0) {
            // this._proxy.loginData = data.msg;
            this._proxy.saveLoginData(data.msg);
            LocalCache.setLoginValidation(otherData);
        }
        cc.systemEvent.emit("loginComplete", data.code);
    }

    /**进入服务器回调*/
    private onEnterServer(data: any): void {
        console.log("LoginProxy  enter:", data);
        //没有创建打开创建
        if (data.code == 9) {
            cc.systemEvent.emit("CreateRole");
            DateUtil.setServerTime(data.msg.time);
        } else {
            if(data.code == 0){
                this._proxy.saveEnterData(data.msg);
                DateUtil.setServerTime(data.msg.time);
                //进入游戏
                MapCommand.getInstance().enterMap();
            }
        }
    }

    /**重连回调*/
    private onServerConneted(): void {
        //重新连接成功 重新登录
        var loginData = this._proxy.getLoginData();
        var roleData = this._proxy.getRoleData();
        console.log("LoginProxy  conneted:", loginData,roleData);
        
        if (loginData) {
            this.account_reLogin(loginData.session,roleData.rid);
        }else{
            cc.systemEvent.emit(NetEvent.ServerHandShake);
        }
    }

    /**重新登录回调回调*/
    private onAccountRelogin(data: any): void {
        //断线重新登录
        console.log("LoginProxy  relogin:", data);
        if(data.code == 0){
            cc.systemEvent.emit(NetEvent.ServerHandShake);
        }
    }

    /**创建角色回调*/
    private onRoleCreate(data: any): void {
        //重换成功再次调用
        if (data.code == 0) {
            this.role_enterServer(this._proxy.serverId);
        }
    }


    
    /**登出回调*/
    private onAccountLogout(data: any): void {
        //重换成功再次调用
        if (data.code == 0) {
            this._proxy.clear();
            cc.systemEvent.emit("enter_login");
        }
    }

    protected onNationMapGiveUp(data: any, otherData: any): void {
        if (data.code == 0) {
            this._proxy.saveEnterData(data.msg);
        }
    }

    public get proxy(): LoginProxy {
        return this._proxy;
    }

    /**
     * register
     * @param data 
     */
    public register(name: string, password: string) {
        var params = "username=" + name
            + "&password=" + CryptoJS.SHA256(password).toString()
            + "&hardware=" + Tools.getUUID();

        var otherData = { username: name, password: password };
        HttpManager.getInstance().doGet(HttpConfig.register.name, HttpConfig.register.url, params, otherData);
    }

    /**
     * login
     * @param data 
     */
    public accountLogin(name: string, password: string) {
        var api_name = ServerConfig.account_login;
        var send_data = {
            name: api_name,
            msg: {
                username: name,
                password: CryptoJS.SHA256(password).toString(),
                hardware: Tools.getUUID()
            }
        };

        var otherData = { username: name, password: password };
        NetManager.getInstance().send(send_data,otherData);
    }


    /**
     * create
     * @param uid 
     * @param nickName 
     * @param sex 
     * @param sid 
     * @param headId 
     */
    public role_create(uid: string, nickName: string, sex: number = 0, sid: number = 0, headId: number = 0) {
        var api_name = ServerConfig.role_create;
        var send_data = {
            name: api_name,
            msg: {
                uid: uid,
                nickName: nickName,
                sex: sex,
                sid: sid,
                headId: headId
            }
        };
        NetManager.getInstance().send(send_data);
    }


    /**
     * enterServer
     * @param sid 
     */
    public role_enterServer(sid: number = 0) {
        var api_name = ServerConfig.role_enterServer;
        var send_data = {
            name: api_name,
            msg: {
                sid: sid,
            }
        };
        NetManager.getInstance().send(send_data);
    }

    /**
     * 重新登录
     * @param session 
     */
    public account_reLogin(session: string,rid:number = 0) {
        var api_name = ServerConfig.account_reLogin;
        var send_data = {
            name: api_name,
            msg: {
                session: session,
                hardware: Tools.getUUID(),
                rid:rid,
            }
        };
        NetManager.getInstance().send(send_data);
    }


    /**
     * logout
     */
    public account_logout():void{
        var api_name = ServerConfig.account_logout;
        var send_data = {
            name: api_name,
            msg: {

            }
        };
        NetManager.getInstance().send(send_data);
    }
}