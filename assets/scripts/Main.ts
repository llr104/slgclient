import { GameConfig } from "./config/GameConfig";
import LoaderManager, { LoadData, LoadDataType } from "./core/LoaderManager";
import ArmyCommand from "./general/ArmyCommand";
import GeneralCommand from "./general/GeneralCommand";
import LoginCommand from "./login/LoginCommand";
import MapCommand from "./map/MapCommand";
import MapUICommand from "./map/ui/MapUICommand";
import { HttpManager } from "./network/http/HttpManager";
import { NetEvent } from "./network/socket/NetInterface";
import { NetManager } from "./network/socket/NetManager";
import { NetNodeType } from "./network/socket/NetNode";
import SkillCommand from "./skill/SkillCommand";
import Toast from "./utils/Toast";
import { Tools } from "./utils/Tools";

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

    @property(cc.Prefab)
    toastPrefab: cc.Prefab = null;

    @property(cc.Node)
    toastNode: cc.Node = null;

    protected _loginScene: cc.Node = null;
    protected _mapScene: cc.Node = null;
    protected _mapUIScene: cc.Node = null;
    protected _loadingNode: cc.Node = null;
    protected _waitNode: cc.Node = null;
    private _retryTimes: number = 0;

    protected onLoad(): void {
        //初始化连接
        NetManager.getInstance().connect({ url: GameConfig.serverUrl , type:NetNodeType.BaseServer });
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
        cc.systemEvent.on("show_toast", this.onShowToast, this);
        cc.systemEvent.on(NetEvent.ServerRequesting, this.showWaitNode,this);
        cc.systemEvent.on(NetEvent.ServerRequestSucess,this.onServerRequest,this);

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
        dataList.push(new LoadData("./world/map", LoadDataType.FILE, cc.TiledMapAsset));
        dataList.push(new LoadData("./config/mapRes_0", LoadDataType.FILE, cc.JsonAsset));
        dataList.push(new LoadData("./config/json/facility/", LoadDataType.DIR, cc.JsonAsset));
        dataList.push(new LoadData("./config/json/general/", LoadDataType.DIR, cc.JsonAsset));
        dataList.push(new LoadData("./generalpic1", LoadDataType.DIR, cc.SpriteFrame));
        dataList.push(new LoadData("./config/basic", LoadDataType.FILE, cc.JsonAsset));
        dataList.push(new LoadData("./config/json/skill/", LoadDataType.DIR, cc.JsonAsset));

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
                GeneralCommand.getInstance().proxy.initGeneralConfig(datas[3],(datas[5] as cc.JsonAsset).json);
                GeneralCommand.getInstance().proxy.initGeneralTex(datas[4]);
                MapUICommand.getInstance().proxy.setBasic(datas[5]);
                SkillCommand.getInstance().proxy.initSkillConfig(datas[6])

                var d = (datas[5] as cc.JsonAsset).json
                MapCommand.getInstance().proxy.setWarFree(d.build.war_free);

                let cityId: number = MapCommand.getInstance().cityProxy.getMyMainCity().cityId;
                GeneralCommand.getInstance().qryMyGenerals();
                ArmyCommand.getInstance().qryArmyList(cityId);
                MapUICommand.getInstance().qryWarReport();

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
        this._waitNode.active = isShow;

    }


    protected showTopToast(text:string = ""):void{
        if(this.toastNode == null){
            let toast = cc.instantiate(this.toastPrefab);
            toast.parent = this.node;
            toast.zIndex = 10;
            this.toastNode = toast;
        }
        this.toastNode.active = true;
        this.toastNode.getComponent(Toast).setText(text);
    }


    private onServerRequest(msg:any):void{
        if(msg.code == undefined || msg.code == 0 || msg.code == 9){
            this._retryTimes = 0;
            return;
        }

        if(msg.code == -1 || msg.code == -2 || msg.code == -3 || msg.code == -4 ){
            if (this._retryTimes < 3){
                LoginCommand.getInstance().role_enterServer(LoginCommand.getInstance().proxy.getSession(), false);
                this._retryTimes += 1;
                return
            }
        }

        this.showTopToast(Tools.getCodeStr(msg.code));
    }

    private onShowToast(msg:string) {
        this.showTopToast(msg);
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
