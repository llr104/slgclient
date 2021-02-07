import LoaderManager, { LoadData, LoadDataType } from "../core/LoaderManager";
import GeneralCommand from "../general/GeneralCommand";
import { GeneralConfig } from "../general/GeneralProxy";
import GeneralRosterLogic from "../map/ui/GeneralRosterLogic";

const { ccclass, property } = cc._decorator;

@ccclass
export default class GeneralTool extends cc.Component {

    @property(cc.EditBox)
    outDirEditBox: cc.EditBox = null;

    @property(cc.Label)
    tipsLab: cc.Label = null;

    @property(cc.Node)
    generalParentNode: cc.Node = null;
    
    
    @property(cc.Node)
    opNode: cc.Node = null;

    @property(cc.Prefab)
    generalRoster: cc.Prefab = null;

    @property(cc.ToggleContainer)
    toggleGroup: cc.ToggleContainer = null;

    @property(cc.EditBox)
    nameEditBox: cc.EditBox = null;

    @property(cc.EditBox)
    wlEditBox: cc.EditBox = null;

    @property(cc.EditBox)
    mlEditBox: cc.EditBox = null;

    @property(cc.EditBox)
    fyEditBox: cc.EditBox = null;

    @property(cc.EditBox)
    gcEditBox: cc.EditBox = null;

    @property(cc.EditBox)
    sdEditBox: cc.EditBox = null;

    @property(cc.EditBox)
    costEditBox: cc.EditBox = null;

    @property(cc.EditBox)
    wlAddEditBox: cc.EditBox = null;

    @property(cc.EditBox)
    mlAddEditBox: cc.EditBox = null;

    @property(cc.EditBox)
    fyAddEditBox: cc.EditBox = null;

    @property(cc.EditBox)
    gcAddEditBox: cc.EditBox = null;

    @property(cc.EditBox)
    sdAddEditBox: cc.EditBox = null;


    _generalNode: cc.Node = null;

    protected _cfgs: GeneralConfig[] = [];

    protected _isLoading = true;

    protected _curIndex = 0;

    protected onLoad(): void {
        
        this.tipsLab.string = "加载中...";
        this.opNode.active = false;

        let dataList: LoadData[] = [];
        dataList.push(new LoadData("./config/json/general/", LoadDataType.DIR, cc.JsonAsset));
        dataList.push(new LoadData("./generalpic", LoadDataType.DIR, cc.SpriteFrame));
        dataList.push(new LoadData("./config/basic", LoadDataType.FILE, cc.JsonAsset));
    
        LoaderManager.getInstance().startLoadList(dataList, null,
            (error: Error, paths: string[], datas: any[]) => {
                if (error != null) {
                    console.log("加载配置文件失败");
                    return;
                }
                console.log("loadComplete", paths, datas);
 
                GeneralCommand.getInstance().proxy.initGeneralConfig(datas[0],(datas[2] as cc.JsonAsset).json);
                GeneralCommand.getInstance().proxy.initGeneralTex(datas[1]);

                this.loadFinish();
            },
            this
        );

        
    }

    protected loadFinish(): void{
        this.opNode.active = true;
        this.tipsLab.string = "";
        this._isLoading = false;

        let cfgs = GeneralCommand.getInstance().proxy.getGeneralAllCfg();
        this._cfgs = Array.from(cfgs.values());
        this._cfgs.sort(this.sortStar);

        this.show(this._curIndex);
    }

    protected show(idx:number):void {
       
        if(this._cfgs.length > 0){
            if(idx < 0){
                idx = this._cfgs.length-1
            }else if(idx >= this._cfgs.length){
                idx = 0
            }

            if(this._generalNode == null){
                var g = cc.instantiate(this.generalRoster);
                g.parent = this.generalParentNode;
                this._generalNode = g;
            }

            var cfg = this._cfgs[idx];
            this._generalNode.getComponent(GeneralRosterLogic).setData(cfg);

            this.nameEditBox.string = cfg.name;
            this.wlEditBox.string = (cfg.force / 100) + "";
            this.fyEditBox.string = (cfg.defense / 100) + "";
            this.mlEditBox.string = (cfg.strategy / 100) + "";
            this.sdEditBox.string = (cfg.speed / 100) + "";
            this.gcEditBox.string = (cfg.destroy / 100) + "";

            this.wlAddEditBox.string = (cfg.force_grow / 100) + "";
            this.fyAddEditBox.string = (cfg.defense_grow / 100) + "";
            this.mlAddEditBox.string = (cfg.strategy_grow / 100) + "";
            this.sdAddEditBox.string = (cfg.speed_grow / 100) + "";
            this.gcAddEditBox.string = (cfg.defense_grow / 100) + "";

            this.costEditBox.string = cfg.cost + "";
            this.toggleGroup.toggleItems[cfg.camp-1].isChecked = true;
        }
    }

    protected refresh(): void {
        //刷新
        this._cfgs[this._curIndex].name = this.nameEditBox.string;
        this._cfgs[this._curIndex].force = parseInt(this.wlEditBox.string)*100;
        this._cfgs[this._curIndex].strategy = parseInt(this.mlEditBox.string)*100;
        this._cfgs[this._curIndex].defense = parseInt(this.fyEditBox.string)*100;
        this._cfgs[this._curIndex].speed = parseInt(this.sdEditBox.string)*100;
        this._cfgs[this._curIndex].destroy = parseInt(this.gcEditBox.string)*100;

        this._cfgs[this._curIndex].force_grow = parseInt(this.wlAddEditBox.string)*100;
        this._cfgs[this._curIndex].strategy_grow = parseInt(this.mlAddEditBox.string)*100;
        this._cfgs[this._curIndex].defense_grow = parseInt(this.fyAddEditBox.string)*100;
        this._cfgs[this._curIndex].speed_grow = parseInt(this.sdAddEditBox.string)*100;
        this._cfgs[this._curIndex].destroy_grow = parseInt(this.gcAddEditBox.string)*100;

        this._cfgs[this._curIndex].cost = parseInt(this.costEditBox.string);

        var items = this.toggleGroup.toggleItems;
        for (let index = 0; index < items.length; index++) {
            const item = items[index];
            if(item.isChecked){
                this._cfgs[this._curIndex].camp = index+1;
            }
        }
    }
    
    protected onClickMake(): void {
        
        if(this._isLoading){
            return
        }

        if (this.outDirEditBox.string == ""){
            this.tipsLab.string = "请输入生成输出目录";
            return
        }

        if (!CC_JSB) {
            this.tipsLab.string = "请使用 Windows 模拟器运行";
            return
        }

        var path = this.outDirEditBox.string;
        if(jsb.fileUtils.isDirectoryExist(path) == false){
            this.tipsLab.string = "目录不存在";
            return
        }

        var obj = Object();
        obj.title = "武将配置";
        obj.list = this._cfgs
       
        var str = JSON.stringify(obj, null, "\t");
        jsb.fileUtils.writeStringToFile(str, path + "/general.json");
        
        this.tipsLab.string = "保存成功";
    }

    
    protected onClickPre(): void {
        if(this._isLoading){
            return
        }

        this.show(this._curIndex-=1)
    }

    protected onClickNext(): void {
        if(this._isLoading){
            return
        }

        this.show(this._curIndex+=1)
    }


    protected sortStar(a: GeneralConfig, b: GeneralConfig): number {

        if(a.star < b.star){
            return 1;
        }else if(a.star == b.star){
            return a.cfgId - b.cfgId;
        }else{
            return -1;
        }
    }

}
