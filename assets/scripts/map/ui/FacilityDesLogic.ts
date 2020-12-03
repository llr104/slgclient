import LoginCommand from "../../login/LoginCommand";
import FacilityAdditionItemLogic from "./FacilityAdditionItemLogic";
import MapUICommand from "./MapUICommand";
import { Facility, FacilityAdditionCfg, FacilityConfig, FacilityUpLevel } from "./MapUIProxy";

const { ccclass, property } = cc._decorator;

@ccclass
export default class FacilityDesLogic extends cc.Component {
    @property(cc.Label)
    labelTitle: cc.Label = null;
    @property(cc.Label)
    labelDes: cc.Label = null;
    @property(cc.RichText)
    labelConditions: cc.RichText = null;
    @property(cc.RichText)
    labelNeed: cc.RichText = null;
    @property(cc.Button)
    btnUp: cc.Button = null;
    @property(cc.Label)
    labelUp: cc.Label = null;
    @property(cc.Node)
    additionNode: cc.Node = null;
    @property(cc.Prefab)
    additionItemPrefab: cc.Prefab = null;

    protected _cityId: number = 0;
    protected _data: Facility = null;
    protected _cfg: FacilityConfig = null;
    protected _additonCfg: FacilityAdditionCfg = null;
    protected _isUnLock: boolean = false;//是否解锁
    protected _isNeedComplete: boolean = false;//是否满足升级需求
    protected _isLevelMax: boolean = false;//是否已达最高等级
    protected _additionPool: cc.NodePool = new cc.NodePool();

    protected onLoad(): void {

    }

    protected onDestroy(): void {

    }

    protected removeAllAdditionItems(): void {
        let children: cc.Node[] = this.additionNode.children.concat();
        this.additionNode.removeAllChildren(false);
        for (let i: number = 0; i < children.length; i++) {
            this._additionPool.put(children[i]);
        }
    }

    protected getAdditionItem(): cc.Node {
        if (this._additionPool.size() > 0) {
            return this._additionPool.get();
        } else {
            return cc.instantiate(this.additionItemPrefab);
        }
    }

    //更新加成描述界面
    public updateAdditionView() {
        this.removeAllAdditionItems();
        for (let i: number = 0; i < this._cfg.additions.length; i++) {
            let item: cc.Node = this.getAdditionItem();
            item.parent = this.additionNode;
            item.getComponent(FacilityAdditionItemLogic).setData(this._data, this._cfg, i);
        }
    }

    //更新解锁条件
    public updateContidionView() {
        this._isUnLock = true;
        if (this._cfg.conditions.length > 0) {
            //有解锁条件
            let contidionList: string[] = [];
            for (let i: number = 0; i < this._cfg.conditions.length; i++) {
                let data: Facility = MapUICommand.getInstance().proxy.getMyFacilityByType(this._cityId, this._cfg.conditions[i].type);
                let cfg: FacilityConfig = MapUICommand.getInstance().proxy.getFacilityCfgByType(this._cfg.conditions[i].type);
                if (data == null || data.level < this._cfg.conditions[i].level) {
                    //不满足条件
                    contidionList.push("<color=#ff0000>" + cfg.name + this._cfg.conditions[i].level + "级</color>");
                    this._isUnLock = false;
                } else {
                    //满足条件
                    contidionList.push("<color=#00ff00>" + cfg.name + this._cfg.conditions[i].level + "级</color>");
                }
            }
            this.labelConditions.node.parent.active = true;
            this.labelConditions.string = contidionList.join("<br/>");
            this.labelConditions.node.parent.height = this.labelConditions.node.height + 30;
        } else {
            this.labelConditions.node.parent.active = false;
        }
    }

    //更新资源需求
    public updateNeedView(): void {
        this._isNeedComplete = true;
        
        let curLevel: number = this._data.level;
        if (curLevel >= 0 && curLevel < this._cfg.upLevels.length) {
            //未达到最高级时
            let roleRes: any = LoginCommand.getInstance().proxy.getRoleResData();
            let upLevel: FacilityUpLevel = this._cfg.upLevels[curLevel];
            let needStrList: string[] = [];
            if (upLevel.grain > 0) {
                if (roleRes.grain < upLevel.grain) {
                    this._isNeedComplete = false;
                    needStrList.push("粮食：<color=#ff0000>" + upLevel.grain + "/" + roleRes.grain + "</color>");
                } else {
                    needStrList.push("粮食：<color=#00ff00>" + upLevel.grain + "/" + roleRes.grain + "</color>");
                }
            }
            if (upLevel.wood > 0) {
                if (roleRes.wood < upLevel.wood) {
                    this._isNeedComplete = false;
                    needStrList.push("木材：<color=#ff0000>" + upLevel.wood + "/" + roleRes.wood + "</color>");
                } else {
                    needStrList.push("木材：<color=#00ff00>" + upLevel.wood + "/" + roleRes.wood + "</color>");
                }
            }
            if (upLevel.iron > 0) {
                if (roleRes.iron < upLevel.iron) {
                    this._isNeedComplete = false;
                    needStrList.push("铁矿：<color=#ff0000>" + upLevel.iron + "/" + roleRes.iron + "</color>");
                } else {
                    needStrList.push("铁矿：<color=#00ff00>" + upLevel.iron + "/" + roleRes.iron + "</color>");
                }
            }
            if (upLevel.stone > 0) {
                if (roleRes.stone < upLevel.stone) {
                    this._isNeedComplete = false;
                    needStrList.push("石头：<color=#ff0000>" + upLevel.stone + "/" + roleRes.stone + "</color>");
                } else {
                    needStrList.push("石头：<color=#00ff00>" + upLevel.stone + "/" + roleRes.stone + "</color>");
                }
            }
            if (upLevel.decree > 0) {
                if (roleRes.decree < upLevel.decree) {
                    this._isNeedComplete = false;
                    needStrList.push("政令：<color=#ff0000>" + upLevel.decree + "/" + roleRes.decree + "</color>");
                } else {
                    needStrList.push("政令：<color=#00ff00>" + upLevel.decree + "/" + roleRes.decree + "</color>");
                }
            }
            this.labelNeed.node.parent.active = true;
            this.labelNeed.string = needStrList.join("<br/>");
            this.labelNeed.node.parent.height = this.labelNeed.node.height + 30;
            this._isLevelMax = false;
        } else {
            this.labelNeed.node.parent.active = false;
            this._isLevelMax = true;
        }
    }

    //更新升级按钮
    public updateUpBtn(): void {
        if (this._isLevelMax) {
            //升满级了
            this.btnUp.node.active = false;
        } else {
            this.btnUp.node.active = true;
            if (this._isUnLock == false) {
                //未解锁
                this.btnUp.interactable = false;
                this.labelUp.string = "未解锁";
            } else if (this._isNeedComplete == false) {
                //资源不足
                this.btnUp.interactable = false;
                this.labelUp.string = "升级";
            } else {
                this.btnUp.interactable = true;
                this.labelUp.string = "升级";
            }
        }
    }

    public setData(cityId: number, data: Facility, cfg: FacilityConfig): void {
        this._cityId = cityId;
        this._data = data;
        this._cfg = cfg;
        this.labelTitle.string = cfg.name;
        this.labelDes.string = cfg.des;
        this.updateAdditionView();
        this.updateContidionView();
        this.updateNeedView();
        this.updateUpBtn();
    }

    protected onClickUp(): void {
        if(this._data.type == 0) {
            //升级主城
            MapUICommand.getInstance().upCity(this._cityId);
        } else {
            MapUICommand.getInstance().upFacility(this._cityId, this._data.type);
        }
    }
}
