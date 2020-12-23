import LoginCommand from "../login/LoginCommand";
import MapCommand from "../map/MapCommand";
import { NetEvent } from "../network/socket/NetInterface";

const { ccclass, property } = cc._decorator;

@ccclass
export default class LoginScene extends cc.Component {
    @property(cc.Prefab)
    loginPrefab: cc.Prefab = null;
    @property(cc.Prefab)
    createPrefab: cc.Prefab = null;
    @property(cc.Prefab)
    serverListPrefab: cc.Prefab = null;

    protected _loginNode: cc.Node = null;
    protected _createNode: cc.Node = null;
    protected _serverListNode: cc.Node = null;

    protected _enterNode: cc.Node = null;

    protected onLoad(): void {
        this.openLogin();
        cc.systemEvent.on("CreateRole", this.onCreate, this);
        cc.systemEvent.on("enterServerComplete", this.enterServer, this);
        
    }

    protected onDestroy(): void {
        cc.systemEvent.targetOff(this);
        this._loginNode = null;
        this._serverListNode = null;
    }

    protected openLogin(): void {
        if (this._loginNode == null) {
            this._loginNode = cc.instantiate(this.loginPrefab);
            this._loginNode.parent = this.node;
        } else {
            this._loginNode.active = true;
        }
    }

    protected onCreate(): void {
        if (this._createNode == null) {
            this._createNode = cc.instantiate(this.createPrefab);
            this._createNode.parent = this.node;
        } else {
            this._createNode.active = true;
        }
    }


    protected enterServer():void{
        cc.systemEvent.emit(NetEvent.ServerRequesting, true);
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
