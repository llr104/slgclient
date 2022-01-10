import { _decorator, Component, Prefab, Node, instantiate, TiledMapAsset, JsonAsset, SpriteFrame, sys, UITransform } from 'cc';
const { ccclass, property } = _decorator;

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
import { EventMgr } from './utils/EventMgr';

@ccclass('Main')
export default class Main extends Component {
    @property(Prefab)
    loginScenePrefab: Prefab = null;

    @property(Prefab)
    mapScenePrefab: Prefab = null;
    @property(Prefab)
    mapUIScenePrefab: Prefab = null;

    @property(Prefab)
    loadingPrefab: Prefab = null;


    @property(Prefab)
    waitPrefab: Prefab = null;

    @property(Prefab)
    toastPrefab: Prefab = null;

    private toastNode: Node = null;

    protected _loginScene: Node = null;
    protected _mapScene: Node = null;
    protected _mapUIScene: Node = null;
    protected _loadingNode: Node = null;
    protected _waitNode: Node = null;
    private _retryTimes: number = 0;

    protected onLoad(): void {

        console.log("main load");
        

        EventMgr.on("enter_map", this.onEnterMap, this);
        EventMgr.on("enter_login", this.enterLogin, this);
        EventMgr.on("show_toast", this.onShowToast, this);
        EventMgr.on(NetEvent.ServerRequesting, this.showWaitNode,this);
        EventMgr.on(NetEvent.ServerRequestSucess,this.onServerRequest,this);


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
       
    }

    protected onDestroy(): void {
        EventMgr.targetOff(this);
    }

    protected clearData(): void {
        MapCommand.getInstance().clearData();
        GeneralCommand.getInstance().clearData();
        ArmyCommand.getInstance().clearData();
    }

    private enterLogin(): void {
        this.clearAllScene();
        this.clearData();
        this._loginScene = instantiate(this.loginScenePrefab);
        this._loginScene.parent = this.node;
    }

    protected onEnterMap(): void {
        let dataList: LoadData[] = [];
        dataList.push(new LoadData("./world/map", LoadDataType.FILE, TiledMapAsset));
        dataList.push(new LoadData("./config/mapRes_0", LoadDataType.FILE, JsonAsset));
        dataList.push(new LoadData("./config/json/facility/", LoadDataType.DIR, JsonAsset));
        dataList.push(new LoadData("./config/json/general/", LoadDataType.DIR, JsonAsset));
        if(sys.isBrowser){
            dataList.push(new LoadData("./generalpic1", LoadDataType.DIR, SpriteFrame));
        }else{
            dataList.push(new LoadData("./generalpic", LoadDataType.DIR, SpriteFrame));
        }
       
        dataList.push(new LoadData("./config/basic", LoadDataType.FILE, JsonAsset));
        dataList.push(new LoadData("./config/json/skill/", LoadDataType.DIR, JsonAsset));

        this.addLoadingNode();
        console.log("onEnterMap");
        LoaderManager.getInstance().startLoadList(dataList, null,
            (error: Error, paths: string[], datas: any[]) => {
                if (error != null) {
                    console.log("加载配置文件失败");
                    return;
                }
                console.log("loadComplete", paths, datas);
                MapCommand.getInstance().proxy.tiledMapAsset = datas[0] as TiledMapAsset;
                MapCommand.getInstance().proxy.initMapResConfig((datas[1] as JsonAsset).json);

                MapUICommand.getInstance().proxy.setAllFacilityCfg(datas[2]);
                GeneralCommand.getInstance().proxy.initGeneralConfig(datas[3],(datas[5] as JsonAsset).json);
                GeneralCommand.getInstance().proxy.initGeneralTex(datas[4]);
                MapUICommand.getInstance().proxy.setBasic(datas[5]);
                SkillCommand.getInstance().proxy.initSkillConfig(datas[6]);

                var d = (datas[5] as JsonAsset).json
                MapCommand.getInstance().proxy.setWarFree(d["build"].war_free);

                let cityId: number = MapCommand.getInstance().cityProxy.getMyMainCity().cityId;
                GeneralCommand.getInstance().qryMyGenerals();
                ArmyCommand.getInstance().qryArmyList(cityId);
                MapUICommand.getInstance().qryWarReport();
                SkillCommand.getInstance().qrySkillList();

                this.clearAllScene();
                this._mapScene = instantiate(this.mapScenePrefab);
                this._mapScene.parent = this.node;
                this._mapUIScene = instantiate(this.mapUIScenePrefab);
                this._mapUIScene.parent = this.node;
            },
            this
        );
    }

    protected addLoadingNode(): void {
        if (this.loadingPrefab) {
            if (this._loadingNode == null) {
                this._loadingNode = instantiate(this.loadingPrefab);
            }
            this._loadingNode.setSiblingIndex(1);
            this._loadingNode.parent = this.node;
        }
    }


    protected showWaitNode(isShow:boolean):void{
        if (this._waitNode == null) {
            this._waitNode = instantiate(this.waitPrefab);
            this._waitNode.parent = this.node;
            this._waitNode.setSiblingIndex(2);
        }
        this._waitNode.active = isShow;

    }


    protected showTopToast(text:string = ""):void{
        if(this.toastNode == null){
            let toast = instantiate(this.toastPrefab);
            toast.parent = this.node;
            toast.setSiblingIndex(10);
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
