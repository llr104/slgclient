
import LoginCommand from "../../login/LoginCommand";
import ArmySelectNodeLogic from "./ArmySelectNodeLogic";
import CityArmySettingLogic from "./CityArmySettingLogic";
import FacilityListLogic from "./FacilityListLogic";
import MapUICommand from "./MapUICommand";
const { ccclass, property } = cc._decorator;

@ccclass
export default class MapUILogic extends cc.Component {

    @property(cc.Prefab)
    facilityPrefab: cc.Prefab = null;
    protected _facilityNode: cc.Node = null;

    @property(cc.Prefab)
    armySettingPrefab: cc.Prefab = null;
    protected _armySettingNode: cc.Node = null;

    @property(cc.Prefab)
    generalPrefab: cc.Prefab = null;
    protected _generalNode: cc.Node = null;

    @property(cc.Prefab)
    generalDesPrefab: cc.Prefab = null;
    protected _generalDesNode: cc.Node = null;

    @property(cc.Prefab)
    cityAboutPrefab: cc.Prefab = null;
    protected _cityAboutNode: cc.Node = null;

    @property(cc.Prefab)
    warReportPrefab: cc.Prefab = null;
    protected _warReportNode: cc.Node = null;
    @property(cc.Prefab)
    armySelectPrefab: cc.Prefab = null;
    protected _armySelectNode: cc.Node = null;


    @property(cc.Prefab)
    drawPrefab: cc.Prefab = null;
    protected _drawNode: cc.Node = null;


    @property(cc.Prefab)
    drawResultrefab: cc.Prefab = null;
    protected _drawResultNode: cc.Node = null;



    
    @property(cc.Prefab)
    unionPrefab: cc.Prefab = null;
    protected _unionNode: cc.Node = null;



    @property(cc.Layout)
    srollLayout: cc.Layout = null;


    @property(cc.Label)
    nameLabel: cc.Label = null;

    @property(cc.Label)
    ridLabel: cc.Label = null;

    protected _nameObj: any = {};

    protected onLoad(): void {

        this._nameObj = {
            decree: "令牌x",
            grain: "谷物x",
            wood: "木材x",
            iron: "金属x",
            stone: "石材x",
            gold: "金钱x",
            wood_yield: "木材+",
            iron_yield: "金属+",
            stone_yield: "石材+",
            grain_yield: "谷物+",
            gold_yield: "金钱+",
            depot_capacity: "仓库+"
        };


        cc.systemEvent.on("open_city_about", this.openCityAbout, this);
        cc.systemEvent.on("open_facility", this.openFacility, this);
        cc.systemEvent.on("open_army_setting", this.openArmySetting, this);
        cc.systemEvent.on("upate_my_roleRes", this.updateRoleRes, this);
        cc.systemEvent.on("open_general_des", this.openGeneralDes, this);
        cc.systemEvent.on("open_general_choose", this.openGeneralChoose, this);
        cc.systemEvent.on("open_army_select_ui", this.onOpenArmySelectUI, this);
        cc.systemEvent.on("open_draw_result", this.openDrawR, this);
        this.updateRoleRes();
        this.updateRole();

    }


    protected onDestroy(): void {
        this.clearAllNode();
        MapUICommand.getInstance().proxy.clearData();
        cc.systemEvent.targetOff(this);
    }

    protected onBack(): void {
        LoginCommand.getInstance().account_logout();
    }


    protected clearAllNode(): void {
        this._facilityNode = null;
        this._generalNode = null;
        this._cityAboutNode = null;
        this._armySelectNode = null;
        this._armySettingNode = null;
        this._drawNode = null;
        this._drawResultNode = null;
        this._generalDesNode = null;
    }


    /**
     * 设施
     */
    protected openFacility(data: any): void {
        if (this._facilityNode == null) {
            this._facilityNode = cc.instantiate(this.facilityPrefab);
            this._facilityNode.zIndex = 2;
            this._facilityNode.parent = this.node;
        } else {
            this._facilityNode.active = true;
        }
        this._facilityNode.getComponent(FacilityListLogic).setData(data);
    }

    protected openArmySetting(cityId: number, order: number): void {
        if (this._armySettingNode == null) {
            this._armySettingNode = cc.instantiate(this.armySettingPrefab);
            this._armySettingNode.zIndex = 2;
            this._armySettingNode.parent = this.node;
        } else {
            this._armySettingNode.active = true;
        }
        this._armySettingNode.getComponent(CityArmySettingLogic).setData(cityId, order);
    }
    /**
     * 武将
     */
    protected openGeneral(data: number[], type: number = 0, position: number = 0, zIndex: number = 0): void {
        if (this._generalNode == null) {
            this._generalNode = cc.instantiate(this.generalPrefab);
            this._generalNode.zIndex = 4;
            this._generalNode.parent = this.node;
        } else {
            this._generalNode.active = true;
        }

        this._generalNode.getComponent("GeneralLogic").setData(data, type, position);
        // this._generalNode.zIndex = zIndex;
    }


    /**
     * 武将选择
     * @param data 
     * @param zIndex 
     */
    protected openGeneralChoose(data: number[], position: number = 0): void {
        this.openGeneral(data, 1, position, 1);
    }

    /**打开军队选择界面*/
    protected onOpenArmySelectUI(cmd: number, x: number, y: number): void {
        if (this._armySelectNode == null) {
            this._armySelectNode = cc.instantiate(this.armySelectPrefab);
            this._armySelectNode.parent = this.node;
        } else {
            this._armySelectNode.active = true;
        }
        this._armySelectNode.getComponent(ArmySelectNodeLogic).setData(cmd, x, y);
    }


    /**
     * 武将详情
     */
    protected openGeneralDes(cfgData: any, curData: any): void {
        if (this._generalDesNode == null) {
            this._generalDesNode = cc.instantiate(this.generalDesPrefab);
            this._generalDesNode.zIndex = 4;
            this._generalDesNode.parent = this.node;
        } else {
            this._generalDesNode.active = true;
        }
        // this._generalDesNode.zIndex = 1;
        this._generalDesNode.getComponent("GeneralAllLogic").setData(cfgData, curData);
    }


    /**
     * 城市
     */
    protected openCityAbout(data: any): void {
        if (this._cityAboutNode == null) {
            this._cityAboutNode = cc.instantiate(this.cityAboutPrefab);
            this._cityAboutNode.zIndex = 1;
            this._cityAboutNode.parent = this.node;
        } else {
            this._cityAboutNode.active = true;
        }
        this._cityAboutNode.getComponent("CityAboutLogic").setData(data);
    }


    /**
     * 战报
     */
    protected openWarReport(): void {
        if (this._warReportNode == null) {
            this._warReportNode = cc.instantiate(this.warReportPrefab);
            this._warReportNode.parent = this.node;
        } else {
            this._warReportNode.active = true;
        }

        this._warReportNode.getComponent("WarReportLogic").updateView();
    }

    /**
     * 角色信息
     */
    protected updateRoleRes(): void {
        var children = this.srollLayout.node.children;
        var roleRes = LoginCommand.getInstance().proxy.getRoleResData();
        var i = 0;
        for (var key in roleRes) {
            children[i].getChildByName("New Label").getComponent(cc.Label).string = this._nameObj[key] + roleRes[key];
            i++;

        }
    }



    /**
     * 抽卡
     */
    protected openDraw(): void {
        if (this._drawNode == null) {
            this._drawNode = cc.instantiate(this.drawPrefab);
            this._drawNode.parent = this.node;
        } else {
            this._drawNode.active = true;
        }
    }




    /**
     * 抽卡结果
     * @param data 
     */
    protected openDrawR(data: any): void {
        if (this._drawResultNode == null) {
            this._drawResultNode = cc.instantiate(this.drawResultrefab);
            this._drawResultNode.parent = this.node;
        } else {
            this._drawResultNode.active = true;
        }
        this._drawResultNode.zIndex = 2;
        this._drawResultNode.getComponent("DrawRLogic").setData(data);
    }



    protected openUnion(): void {
        if (this._unionNode == null) {
            this._unionNode = cc.instantiate(this.unionPrefab);
            this._unionNode.parent = this.node;
        } else {
            this._unionNode.active = true;
        }
    }

    protected updateRole(): void {
        var roleData = LoginCommand.getInstance().proxy.getRoleData();
        this.nameLabel.string = "昵称: " + roleData.nickName;
        this.ridLabel.string = "角色ID: " + roleData.rid + "";
    }

}
