import { _decorator, Component, EditBox, Label, Node, Prefab, ToggleContainer, instantiate, JsonAsset, SpriteFrame } from 'cc';
const { ccclass, property } = _decorator;

import LoaderManager, { LoadData, LoadDataType } from "../core/LoaderManager";
import GeneralCommand from "../general/GeneralCommand";
import { GeneralConfig } from "../general/GeneralProxy";
import GeneralRosterLogic from "../map/ui/GeneralRosterLogic";
import { JSB } from 'cc/env';

@ccclass('GeneralTool')
export default class GeneralTool extends Component {

    @property(EditBox)
    outDirEditBox: EditBox = null;

    @property(Label)
    tipsLab: Label = null;

    @property(Node)
    generalParentNode: Node = null;
    
    
    @property(Node)
    opNode: Node = null;

    @property(Prefab)
    generalRoster: Prefab = null;

    @property(ToggleContainer)
    toggleCampGroup: ToggleContainer = null;

    @property(ToggleContainer)
    toggleArmGroup: ToggleContainer = null;


    @property(EditBox)
    nameEditBox: EditBox = null;

    @property(EditBox)
    xjEditBox: EditBox = null;

    @property(EditBox)
    wlEditBox: EditBox = null;

    @property(EditBox)
    mlEditBox: EditBox = null;

    @property(EditBox)
    fyEditBox: EditBox = null;

    @property(EditBox)
    gcEditBox: EditBox = null;

    @property(EditBox)
    sdEditBox: EditBox = null;

    @property(EditBox)
    costEditBox: EditBox = null;

    @property(EditBox)
    wlAddEditBox: EditBox = null;

    @property(EditBox)
    mlAddEditBox: EditBox = null;

    @property(EditBox)
    fyAddEditBox: EditBox = null;

    @property(EditBox)
    gcAddEditBox: EditBox = null;

    @property(EditBox)
    sdAddEditBox: EditBox = null;


    _generalNode: Node = null;

    protected _cfgs: GeneralConfig[] = [];

    protected _isLoading = true;

    protected _curIndex = 0;

    protected onLoad(): void {
        
        this.tipsLab.string = "加载中...";
        this.opNode.active = false;

        let dataList: LoadData[] = [];
        dataList.push(new LoadData("./config/json/general/", LoadDataType.DIR, JsonAsset));
        dataList.push(new LoadData("./generalpic", LoadDataType.DIR, SpriteFrame));
        dataList.push(new LoadData("./config/basic", LoadDataType.FILE, JsonAsset));
    
        LoaderManager.getInstance().startLoadList(dataList, null,
            (error: Error, paths: string[], datas: any[]) => {
                if (error != null) {
                    console.log("加载配置文件失败");
                    return;
                }
                console.log("loadComplete", paths, datas);
 
                GeneralCommand.getInstance().proxy.initGeneralConfig(datas[0],(datas[2] as JsonAsset).json);
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

        
        var probability: number = 100;
        for (let index = 0; index < this._cfgs.length; index++) {
            var e = this._cfgs[index];
            if (e.star == 5){
                probability = Math.floor(Math.random() * 20) + 5;
            }else if(e.star == 4){
                probability = Math.floor(Math.random() * 30) + 20;
            }else if(e.star == 3){
                probability = Math.floor(Math.random() * 200) + 300;
            }else if(e.star == 2){
                probability = Math.floor(Math.random() * 200) + 400;
            }else if(e.star == 1){
                probability = Math.floor(Math.random() * 200) + 500;
            }
            e.probability = probability;
        }
        

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
                var g = instantiate(this.generalRoster);
                g.parent = this.generalParentNode;
                this._generalNode = g;
            }

            var cfg = this._cfgs[idx];
            this._generalNode.getComponent(GeneralRosterLogic).setData(cfg);

            this.nameEditBox.string = cfg.name;
            this.xjEditBox.string = cfg.star + "";

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
            this.toggleCampGroup.toggleItems[cfg.camp-1].isChecked = true;

            console.log("cfg.arms:", cfg);
            if(cfg.arms[0] == 1){
                this.toggleArmGroup.toggleItems[0].isChecked = true;
            }else if(cfg.arms[0] == 2){
                this.toggleArmGroup.toggleItems[1].isChecked = true;
            }else {
                this.toggleArmGroup.toggleItems[2].isChecked = true;
            }
            
        }
    }

    protected refresh(): void {
        console.log("refresh");

        //刷新
        this._cfgs[this._curIndex].name = this.nameEditBox.string;

        var xj = parseInt(this.xjEditBox.string);
        if(0 < xj && xj <= 5){
            this._cfgs[this._curIndex].star = xj;
        } 

        this._cfgs[this._curIndex].force = parseInt(this.wlEditBox.string)*100;
        this._cfgs[this._curIndex].strategy = parseInt(this.mlEditBox.string)*100;
        this._cfgs[this._curIndex].defense = parseInt(this.fyEditBox.string)*100;
        this._cfgs[this._curIndex].speed = parseInt(this.sdEditBox.string)*100;
        this._cfgs[this._curIndex].destroy = parseInt(this.gcEditBox.string)*100;

        this._cfgs[this._curIndex].force_grow = Number(this.wlAddEditBox.string)*100;
        this._cfgs[this._curIndex].strategy_grow = Number(this.mlAddEditBox.string)*100;
        this._cfgs[this._curIndex].defense_grow = Number(this.fyAddEditBox.string)*100;
        this._cfgs[this._curIndex].speed_grow = Number(this.sdAddEditBox.string)*100;
        this._cfgs[this._curIndex].destroy_grow = Number(this.gcAddEditBox.string)*100;

        this._cfgs[this._curIndex].cost = parseInt(this.costEditBox.string);

        var items = this.toggleCampGroup.toggleItems;
        for (let index = 0; index < items.length; index++) {
            let item = items[index];
            if(item.isChecked){
                this._cfgs[this._curIndex].camp = index+1;
            }
        }

        var items2 = this.toggleArmGroup.toggleItems;
        for (let index = 0; index < items2.length; index++) {
            let item = items2[index];
            if(item.isChecked){
                if(index == 0){
                    this._cfgs[this._curIndex].arms = [1,4,7];
                }else if(index == 1){
                    this._cfgs[this._curIndex].arms = [2,5,8];
                }else{
                    this._cfgs[this._curIndex].arms = [3,6,9];
                }
            }
        }
    }
    
    protected onClickMake(): void {
        
        if(this._isLoading){
            return
        }

        this.refresh();

        if (this.outDirEditBox.string == ""){
            this.tipsLab.string = "请输入生成输出目录";
            return
        }

        if (!JSB) {
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

        this.refresh();

        this._curIndex-=1;
        this.show(this._curIndex);
    }

    protected onClickNext(): void {
        if(this._isLoading){
            return
        }

        this.refresh();
        this._curIndex+=1;
        this.show(this._curIndex);
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
