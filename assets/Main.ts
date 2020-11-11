import { GameConfig } from "./scripts/config/GameConfig";
import LoginCommand from "./scripts/login/LoginCommand";
import { HttpManager } from "./scripts/network/http/HttpManager";
import { NetManager } from "./scripts/network/socket/NetManager";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Main extends cc.Component {
    @property(cc.Prefab)
    loginPrefab: cc.Prefab = null;

    @property(cc.Prefab)
    createPrefab: cc.Prefab = null;

    @property(cc.Prefab)
    mapPrefab: cc.Prefab = null;

    protected _loginNode: cc.Node = null;
    protected _createNode: cc.Node = null;
    protected _mapNode: cc.Node = null;

    protected onLoad(): void {
        //初始化连接
        NetManager.getInstance().connect({ url: GameConfig.serverUrl });
        HttpManager.getInstance().setWebUrl(GameConfig.webUrl);

        //初始化业务模块
        LoginCommand.getInstance();

        cc.systemEvent.on("create", this.onCreate, this);
        cc.systemEvent.on("enter_map", this.onEnterMap, this);
    }

    protected onDestroy(): void {
        cc.systemEvent.targetOff(this);
    }

    private onClick(): void {
        this._loginNode = cc.instantiate(this.loginPrefab);
        this._loginNode.zIndex = 2;
        this._loginNode.parent = this.node;
    }

    private onCreate(): void {
        this._createNode = cc.instantiate(this.createPrefab);
        this._createNode.zIndex = 2;
        this._createNode.parent = this.node;
    }

    protected onEnterMap(): void {
        if (this._loginNode) {
            this._loginNode.destroy();
            this._loginNode = null;
        }
        if (this._createNode) {
            this._createNode.destroy();
            this._createNode = null;
        }
        this._mapNode = cc.instantiate(this.mapPrefab);
        this._mapNode.zIndex = 1;
        this._mapNode.parent = this.node;
    }
}
