import { GameConfig } from "./scripts/config/GameConfig";
import LoaderManager, { LoadData, LoadDataType } from "./scripts/core/LoaderManager";
import ArmyCommand from "./scripts/general/ArmyCommand";
import GeneralCommand from "./scripts/general/GeneralCommand";
import LoginCommand from "./scripts/login/LoginCommand";
import MapCommand from "./scripts/map/MapCommand";
import MapUICommand from "./scripts/map/ui/MapUICommand";
import { HttpManager } from "./scripts/network/http/HttpManager";
import { NetEvent } from "./scripts/network/socket/NetInterface";
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

    @property(cc.Prefab)
    loadingPrefab: cc.Prefab = null;


    @property(cc.Prefab)
    waitPrefab: cc.Prefab = null;

    protected _loginScene: cc.Node = null;
    protected _mapScene: cc.Node = null;
    protected _mapUIScene: cc.Node = null;
    protected _loadingNode: cc.Node = null;
    protected _waitNode: cc.Node = null;

    protected onLoad(): void {
        //初始化连接
        NetManager.getInstance().connect({ url: GameConfig.serverUrl });
        HttpManager.getInstance().setWebUrl(GameConfig.webUrl);

        //初始化业务模块
        LoginCommand.getInstance();
        MapCommand.getInstance();
        MapUICommand.getInstance();
        GeneralCommand.getInstance();
        ArmyCommand.getInstance();

        this.enterLogin();
        cc.systemEvent.on("enter_map", this.onEnterMap, this);
        cc.systemEvent.on("enter_login", this.enterLogin, this);
        cc.systemEvent.on(NetEvent.ServerRequesting, this.showWaitNode,this);
    }

    protected onDestroy(): void {
        cc.systemEvent.targetOff(this);
    }

    protected clearData(): void {
        MapCommand.getInstance().clearData();
        GeneralCommand.getInstance().clearData();
        ArmyCommand.getInstance().clearData();
    }

    private enterLogin(): void {
        this.clearAllScene();
        this.clearData();
        this._loginScene = cc.instantiate(this.loginScenePrefab);
        this._loginScene.parent = this.node;
    }

    protected onEnterMap(): void {
        let dataList: LoadData[] = [];
        dataList.push(new LoadData("./world/worldMap", LoadDataType.FILE, cc.TiledMapAsset));
        dataList.push(new LoadData("./config/mapRes_0", LoadDataType.FILE, cc.JsonAsset));
        dataList.push(new LoadData("./config/json/facility/", LoadDataType.DIR, cc.JsonAsset));
        dataList.push(new LoadData("./config/json/general/", LoadDataType.DIR, cc.JsonAsset));
        dataList.push(new LoadData("./generalpic", LoadDataType.DIR, cc.SpriteFrame));
        this.addLoadingNode();
        console.log("onEnterMap");
        LoaderManager.getInstance().startLoadList(dataList, null,
            (error: Error, paths: string[], datas: any[]) => {
                if (error != null) {
                    console.log("加载配置文件失败");
                    return;
                }
                console.log("loadComplete", paths, datas);
                MapCommand.getInstance().proxy.tiledMapAsset = datas[0] as cc.TiledMapAsset;
                MapCommand.getInstance().proxy.initMapResConfig((datas[1] as cc.JsonAsset).json);
                MapUICommand.getInstance().proxy.setAllFacilityCfg(datas[2]);
                GeneralCommand.getInstance().proxy.initGeneralConfig(datas[3]);
                GeneralCommand.getInstance().proxy.initGeneralTex(datas[4]);

                let cityId: number = MapCommand.getInstance().cityProxy.getMyMainCity().cityId;
                GeneralCommand.getInstance().qryMyGenerals();
                ArmyCommand.getInstance().qryArmyList(cityId);

                this.clearAllScene();
                this._mapScene = cc.instantiate(this.mapScenePrefab);
                this._mapScene.parent = this.node;
                this._mapUIScene = cc.instantiate(this.mapUIScenePrefab);
                this._mapUIScene.parent = this.node;
            },
            this
        );
    }

    protected addLoadingNode(): void {
        if (this.loadingPrefab) {
            if (this._loadingNode == null) {
                this._loadingNode = cc.instantiate(this.loadingPrefab);
            }
            this._loadingNode.zIndex = 1;
            this._loadingNode.parent = this.node;
        }
    }


    protected showWaitNode(isShow:boolean):void{
        if (this._waitNode == null) {
            this._waitNode = cc.instantiate(this.waitPrefab);
            this._waitNode.parent = this.node;
            this._waitNode.zIndex = 2;
        }
        console.log("showWaitNode:",isShow)
        this._waitNode.active = isShow;
    }

    protected clearAllScene() {
        if (this._mapScene) {
            this._mapScene.destroy();
            this._mapScene = null;
        }

        if (this._mapUIScene) {
            this._mapUIScene.destroy();
            this._mapUIScene = null;
        }

        if (this._loginScene) {
            this._loginScene.destroy();
            this._loginScene = null;
        }
        
        if (this._waitNode) {
            this._waitNode.destroy();
            this._waitNode = null;
        }
        
    }
}
