import { HttpConfig } from "../config/HttpConfig";
import { ServerConfig } from "../config/ServerConfig";
import { HttpManager } from "../network/http/HttpManager";
import { NetManager } from "../network/socket/NetManager";
import { Tools } from "../utils/Tools";
import LoginProxy from "./LoginProxy";
import { NetEvent } from "../network/socket/NetInterface";
import MapCommand from "../map/MapCommand";
import { LocalCache } from "../utils/LocalCache";
import DateUtil from "../utils/DateUtil";
import { EventMgr } from "../utils/EventMgr";
import { Md5 } from "../libs/crypto/md5";

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
        EventMgr.on(NetEvent.ServerCheckLogin, this.onServerConneted, this);
        EventMgr.on(HttpConfig.register.name, this.onRegister, this);
        EventMgr.on(ServerConfig.account_login, this.onAccountLogin, this);
        EventMgr.on(ServerConfig.role_enterServer, this.onEnterServer, this);
        EventMgr.on(ServerConfig.account_reLogin, this.onAccountRelogin, this);
        EventMgr.on(ServerConfig.role_create, this.onRoleCreate, this);
        EventMgr.on(ServerConfig.account_logout, this.onAccountLogout, this);
        EventMgr.on(ServerConfig.account_robLogin, this.onAccountRobLogin, this)
        EventMgr.on(ServerConfig.chat_login, this.onChatLogin, this)

    }

    public onDestory(): void {
        EventMgr.targetOff(this);
    }

    //抢登录
    private onAccountRobLogin(): void{
        console.log("onAccountRobLogin")
        EventMgr.emit("robLoginUI");
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


            this.role_enterServer(this._proxy.getSession());           
            EventMgr.emit("loginComplete", data.code);
        }
        
    }

    /**进入服务器回调*/
    private onEnterServer(data: any,isLoadMap:boolean): void {
        console.log("LoginProxy  enter:", data,isLoadMap);
        //没有创建打开创建
        if (data.code == 9) {
            EventMgr.emit("CreateRole");
            DateUtil.setServerTime(data.msg.time);
        } else {
            if(data.code == 0){
                this._proxy.saveEnterData(data.msg);
                DateUtil.setServerTime(data.msg.time);

                // var roleData = this._proxy.getRoleData();
                // this.chatLogin(roleData.rid, data.msg.token, roleData.nickName);

                 //进入游戏
                if(isLoadMap == true){
                    console.log("enterServerComplete");
                    MapCommand.getInstance().enterMap();
                    EventMgr.emit("enterServerComplete");
                }else{
                    EventMgr.emit(NetEvent.ServerHandShake);
                }

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
            this.account_reLogin(loginData.session);
        }else{
            EventMgr.emit(NetEvent.ServerHandShake);
        }
    }

    /**重新登录回调回调*/
    private onAccountRelogin(data: any): void {
        //断线重新登录
        console.log("LoginProxy  relogin:", data);
        if(data.code == 0){
            // EventMgr.emit(NetEvent.ServerHandShake);
            this.role_enterServer(this._proxy.getSession(),false);
        }
    }

    /**创建角色回调*/
    private onRoleCreate(data: any): void {
        //重换成功再次调用
        if (data.code == 0) {
            this.role_enterServer(this._proxy.getSession());
        }
    }


    
    /**登出回调*/
    private onAccountLogout(data: any): void {
        //重换成功再次调用
        if (data.code == 0) {
            this._proxy.clear();
            EventMgr.emit("enter_login");
        }
    }




    //聊天登录
    private onChatLogin(data: any): void{
        console.log("onChatLogin:",data);
    }

    public get proxy(): LoginProxy {
        return this._proxy;
    }

    /**
     * register
     * @param data 
     */
    public register(name: string, password: string) {

        var pwd =  Md5.encrypt(password);
        var params = "username=" + name
            + "&password=" + pwd
            + "&hardware=" + Tools.getUUID();

        console.log("register:", params);
        var otherData = { username: name, password: password };
        HttpManager.getInstance().doGet(HttpConfig.register.name, HttpConfig.register.url, params, otherData);
    }

    /**
     * login
     * @param data 
     */
    public accountLogin(name: string, password: string) {
        
        var api_name = ServerConfig.account_login;
        var pwd =  Md5.encrypt(password);

        var send_data = {
            name: api_name,
            msg: {
                username: name,
                password: pwd,
                hardware: Tools.getUUID()
            }
        };

        console.log("accountLogin:", send_data);
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


    public role_enterServer(session: string,isLoadMap:boolean = true) {
        var api_name = ServerConfig.role_enterServer;
        var send_data = {
            name: api_name,
            msg: {
                session: session,
            }
        };
        NetManager.getInstance().send(send_data,isLoadMap);
    }

    /**
     * 重新登录
     * @param session 
     */
    public account_reLogin(session: string) {
        var api_name = ServerConfig.account_reLogin;
        var send_data = {
            name: api_name,
            msg: {
                session: session,
                hardware: Tools.getUUID()
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


    public chatLogin(rid:number, token: string, nick_name:string = ''):void{
        var api_name = ServerConfig.chat_login;
        var send_data = {
            name: api_name,
            msg: {
                rid:rid,
                token:token,
                nickName:nick_name
            }
        };

        console.log("send_data:", send_data);
        NetManager.getInstance().send(send_data);
    }
}
