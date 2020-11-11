import { HttpManager } from "../network/http/HttpManager";
import { NetManager } from "../network/socket/NetManager";
import { Tools } from "../scripts/utils/Tools";
var CryptoJS = require("crypto-js.min");
var HttpConfig = require("HttpConfig");
var ServerConfig = require("ServerConfig");

export class LoginCommand {


    /**
     * register
     * @param data 
     */
    public register(name:string,password:string){
        var params = "username="+name
        +"&password="+ CryptoJS.SHA256(password).toString()
        +"&hardware=" + Tools.getUUID();

        var otherData = {username:name,password:password};
        HttpManager.getInstance().doGet(HttpConfig.register.name,HttpConfig.register.url,params,otherData);
    }



    /**
     * login
     * @param data 
     */
    public accountLogin(name:string,password:string){
        var api_name = ServerConfig.account_login;
        var send_data = {name:api_name,
            msg:{
                username:name,
                password:CryptoJS.SHA256(password).toString(),
                hardware:Tools.getUUID()
            }
        };


        NetManager.getInstance().send(send_data);
    }


    /**
     * create
     * @param uid 
     * @param nickName 
     * @param sex 
     * @param sid 
     * @param headId 
     */
    public role_create(uid:string,nickName:string,sex:number = 0,sid:number = 0,headId:number = 0){
        var api_name = ServerConfig.role_create;
        var send_data = {name:api_name,
            msg:{
                uid:uid,
                nickName:nickName,
                sex:sex,
                sid:sid,
                headId:headId
            }
        };
            
        NetManager.getInstance().send(send_data);
    }


    /**
     * enterServer
     * @param sid 
     */
    public role_enterServer(sid:number = 0){
        var api_name = ServerConfig.role_enterServer;
        var send_data = {name:api_name,
            msg:{
                sid:sid,
            }
        };
        NetManager.getInstance().send(send_data);
    }



    /**
     * 重新登录
     * @param session 
     */
    public account_reLogin(session:string){
        var api_name = ServerConfig.account_reLogin;
        var send_data = {name:api_name,
            msg:{
                session:session,
                hardware:Tools.getUUID()
            }
        };
        NetManager.getInstance().send(send_data);
    }
}