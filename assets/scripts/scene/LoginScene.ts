import { _decorator, Component, Prefab, Node, instantiate } from 'cc';
const { ccclass, property } = _decorator;

import LoginCommand from "../login/LoginCommand";
import { NetEvent } from "../network/socket/NetInterface";
import { EventMgr } from '../utils/EventMgr';

@ccclass('LoginScene')
export default class LoginScene extends Component {
    @property(Prefab)
    loginPrefab: Prefab = null;
    @property(Prefab)
    createPrefab: Prefab = null;
    @property(Prefab)
    serverListPrefab: Prefab = null;

    protected _loginNode: Node = null;
    protected _createNode: Node = null;
    protected _serverListNode: Node = null;

    protected _enterNode: Node = null;

    protected onLoad(): void {
        this.openLogin();
        EventMgr.on("CreateRole", this.onCreate, this);
        EventMgr.on("enterServerComplete", this.enterServer, this);
        
    }

    protected onDestroy(): void {
        EventMgr.targetOff(this);
        this._loginNode = null;
        this._serverListNode = null;
    }

    protected openLogin(): void {
        if (this._loginNode == null) {
            this._loginNode = instantiate(this.loginPrefab);
            this._loginNode.parent = this.node;
        } else {
            this._loginNode.active = true;
        }
    }

    protected onCreate(): void {
        if (this._createNode == null) {
            this._createNode = instantiate(this.createPrefab);
            this._createNode.parent = this.node;
        } else {
            this._createNode.active = true;
        }
    }


    protected enterServer():void{
        console.log("enterServer");
        EventMgr.emit(NetEvent.ServerRequesting, true);
    }

    protected onClickEnter(): void {
        //未登录 就弹登录界面

        var loginData = LoginCommand.getInstance().proxy.getLoginData();
        if (loginData == null) {
            this.openLogin();
            return;
        }
        //登录完成进入服务器
        LoginCommand.getInstance().role_enterServer(LoginCommand.getInstance().proxy.getSession());
    }
}
