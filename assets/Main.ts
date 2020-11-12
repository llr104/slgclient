import { GameConfig } from "./scripts/config/GameConfig";
import LoginCommand from "./scripts/login/LoginCommand";
import MapCommand from "./scripts/map/MapCommand";
import { HttpManager } from "./scripts/network/http/HttpManager";
import { NetManager } from "./scripts/network/socket/NetManager";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Main extends cc.Component {
    @property(cc.Prefab)
    loginScenePrefab: cc.Prefab = null;

    @property(cc.Prefab)
    mapScenePrefab: cc.Prefab = null;
    @property(cc.Prefab)
    mapUIScenePrefab: cc.Prefab = null;

    protected _loginScene: cc.Node = null;
    protected _mapScene: cc.Node = null;
    protected _mapUIScene: cc.Node = null;

    protected onLoad(): void {
        //初始化连接
        NetManager.getInstance().connect({ url: GameConfig.serverUrl });
        HttpManager.getInstance().setWebUrl(GameConfig.webUrl);

        //初始化业务模块
        LoginCommand.getInstance();
        MapCommand.getInstance();

        this.enterLogin();
        cc.systemEvent.on("enter_map", this.onEnterMap, this);
    }

    protected onDestroy(): void {
        cc.systemEvent.targetOff(this);
    }

    private enterLogin(): void {
        this._loginScene = cc.instantiate(this.loginScenePrefab);
        this._loginScene.parent = this.node;
    }

    protected onEnterMap(): void {
        if (this._loginScene) {
            this._loginScene.destroy();
            this._loginScene = null;
        }
        this._mapScene = cc.instantiate(this.mapScenePrefab);
        this._mapScene.parent = this.node;
        this._mapUIScene = cc.instantiate(this.mapUIScenePrefab);
        this._mapUIScene.parent = this.node;
    }
}
