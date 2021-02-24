
import LoginCommand from "../../login/LoginCommand";
import ArmySelectNodeLogic from "./ArmySelectNodeLogic";
import CityArmySettingLogic from "./CityArmySettingLogic";
import FacilityListLogic from "./FacilityListLogic";
import MapUICommand from "./MapUICommand";

import Dialog from "./Dialog";
import UnionCommand from "../../union/UnionCommand";
import MapCommand from "../MapCommand";
import FortressAbout from "./FortressAbout";
import CityAboutLogic from "./CityAboutLogic";
import GeneralListLogic from "./GeneralListLogic";
import TransformLogic from "./TransformLogic";
import { Tools } from "../../utils/Tools";
import GeneralInfoLogic from "./GeneralInfoLogic";
import WarReportLogic from "./WarReportLogic";
import DrawRLogic from "./DrawRLogic";


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
    dialog: cc.Prefab = null;
    protected _dialogNode: cc.Node = null;

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
    fortressAboutPrefab: cc.Prefab = null;
    protected _fortressAboutNode: cc.Node = null;

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

    @property(cc.Prefab)
    chatPrefab: cc.Prefab = null;
    protected _chatNode: cc.Node = null;

    @property(cc.Prefab)
    collectPrefab: cc.Prefab = null;
    protected _collectNode: cc.Node = null;


    @property(cc.Prefab)
    transFormPrefab: cc.Prefab = null;
    protected _transFormNode: cc.Node = null;

    @property(cc.Prefab)
    generalConvertPrefab: cc.Prefab = null;
    protected _generalConvertNode: cc.Node = null;

    @property(cc.Prefab)
    generalRosterPrefab: cc.Prefab = null;
    protected _generalRosterNode: cc.Node = null;

    @property(cc.Prefab)
    skillPrefab: cc.Prefab = null;
    protected _skillNode: cc.Node = null;

    @property(cc.Node)
    widgetNode: cc.Node = null;

    @property(cc.Layout)
    srollLayout: cc.Layout = null;

    @property(cc.Label)
    nameLabel: cc.Label = null;

    @property(cc.Label)
    ridLabel: cc.Label = null;

    protected _resArray: any = [];
    protected _yieldArray: any = [];

    protected onLoad(): void {

        this._resArray.push({key:"grain", name:"谷:"});
        this._resArray.push({key:"wood", name:"木:"});
        this._resArray.push({key:"iron", name:"铁:"});
        this._resArray.push({key:"stone", name:"石:"});
        this._resArray.push({key:"gold", name:"钱:"});

        this._yieldArray.push({key:"wood_yield", name:"木+"});
        this._yieldArray.push({key:"iron_yield", name:"铁+"});
        this._yieldArray.push({key:"stone_yield", name:"石+"});
        this._yieldArray.push({key:"grain_yield", name:"谷+"});


        cc.systemEvent.on("open_city_about", this.openCityAbout, this);
        cc.systemEvent.on("close_city_about", this.closeCityAbout, this);

        cc.systemEvent.on("open_fortress_about", this.openFortressAbout, this);
        cc.systemEvent.on("open_facility", this.openFacility, this);


        cc.systemEvent.on("open_army_setting", this.openArmySetting, this);
        cc.systemEvent.on("upate_my_roleRes", this.updateRoleRes, this);
        cc.systemEvent.on("open_general_des", this.openGeneralDes, this);
        cc.systemEvent.on("open_general_choose", this.openGeneralChoose, this);
        cc.systemEvent.on("open_army_select_ui", this.onOpenArmySelectUI, this);
        cc.systemEvent.on("open_draw_result", this.openDrawR, this);
        cc.systemEvent.on("robLoginUI", this.robLoginUI, this);
        cc.systemEvent.on("interior_collect", this.onCollection, this);
        cc.systemEvent.on("open_general_convert", this.onOpenGeneralConvert, this);
        cc.systemEvent.on("open_general_roster", this.onOpenGeneralRoster, this);
        
        cc.systemEvent.on("open_general", this.openGeneral, this);
        
        

        this.updateRoleRes();
        this.updateRole();
        let unionId = MapCommand.getInstance().cityProxy.myUnionId;
        if (unionId > 0) {
            UnionCommand.getInstance().unionApplyList(unionId);
        }
    }

    protected robLoginUI(): void {
        this.showTip("账号在其他地方登录",function () {
            cc.systemEvent.emit("enter_login");
        });
    }

    protected showTip(text:string, close:Function):void {
        if (this._dialogNode == null){
            this._dialogNode = cc.instantiate(this.dialog)
            this._dialogNode.zIndex = 10;
            this._dialogNode.parent = this.node;
        }else{
            this._dialogNode.active = true;
        }

        this._dialogNode.getComponent(Dialog).text(text);
        this._dialogNode.getComponent(Dialog).setClose(close)
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
        this._fortressAboutNode = null;
        this._armySelectNode = null;
        this._armySettingNode = null;
        this._drawNode = null;
        this._drawResultNode = null;
        this._generalDesNode = null;
        this._dialogNode = null
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
            this._generalNode.zIndex = 3;
            this._generalNode.parent = this.node;
        } else {
            this._generalNode.active = true;
        }

        this._generalNode.getComponent(GeneralListLogic).setData(data, type, position);
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
        this._generalDesNode.getComponent(GeneralInfoLogic).setData(cfgData, curData);
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


        this.widgetNode.active = false;
        cc.systemEvent.emit("scroll_to_map", data.x, data.y);
        this._cityAboutNode.getComponent(CityAboutLogic).setData(data);
    }

    protected closeCityAbout(): void {
        this.widgetNode.active = true;
    }
    
    protected openFortressAbout(data: any): void {
        if (this._fortressAboutNode == null) {
            this._fortressAboutNode = cc.instantiate(this.fortressAboutPrefab);
            this._fortressAboutNode.zIndex = 1;
            this._fortressAboutNode.parent = this.node;
        } else {
            this._fortressAboutNode.active = true;
        }
        this._fortressAboutNode.getComponent(FortressAbout).setData(data);
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

        this._warReportNode.getComponent(WarReportLogic).updateView();
    }

    /**
     * 角色信息
     */
    protected updateRoleRes(): void {
        var children = this.srollLayout.node.children;
        var roleRes = LoginCommand.getInstance().proxy.getRoleResData();

        var i = 0;
        children[i].getChildByName("New Label").getComponent(cc.Label).string = "令牌:" + Tools.numberToShow(roleRes["decree"]);
        i+=1;
        

        for (let index = 0; index < this._resArray.length; index++) {
            const obj = this._resArray[index];
            var label = children[i].getChildByName("New Label").getComponent(cc.Label)

            if(obj.key == "gold"){
                label.string = obj.name + Tools.numberToShow(roleRes[obj.key]);
            }else{
                label.string = obj.name + Tools.numberToShow(roleRes[obj.key]) + "/" + Tools.numberToShow(roleRes["depot_capacity"]);
            }
            
            i+=1;
        }

        for (let index = 0; index < this._yieldArray.length; index++) {
            const obj = this._yieldArray[index];
            var label = children[i].getChildByName("New Label").getComponent(cc.Label)
            label.string = obj.name + Tools.numberToShow(roleRes[obj.key]);
            i+=1;
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
        this._drawResultNode.getComponent(DrawRLogic).setData(data);
    }



    protected openUnion(): void {
        if (this._unionNode == null) {
            this._unionNode = cc.instantiate(this.unionPrefab);
            this._unionNode.parent = this.node;
        } else {
            this._unionNode.active = true;
        }
    }


    protected openChat(): void {
        if (this._chatNode == null) {
            this._chatNode = cc.instantiate(this.chatPrefab);
            this._chatNode.parent = this.node;
        } else {
            this._chatNode.active = true;
        }
        
    }



    protected openTr(): void {
        if (this._transFormNode == null) {
            this._transFormNode = cc.instantiate(this.transFormPrefab);
            this._transFormNode.parent = this.node;
        } else {
            this._transFormNode.active = true;
        }

        this._transFormNode.getComponent(TransformLogic).initView();
    }

    protected onOpenGeneralConvert(): void {
        console.log("onOpenGeneralConvert");
        if (this._generalConvertNode == null) {
            this._generalConvertNode = cc.instantiate(this.generalConvertPrefab);
            this._generalConvertNode.parent = this.node;
            this._generalConvertNode.zIndex = 4;
        } else {
            this._generalConvertNode.active = true;
        }

    }

    protected onOpenGeneralRoster(): void {
        console.log("onOpenGeneralRoster");
        if (this._generalRosterNode == null) {
            this._generalRosterNode = cc.instantiate(this.generalRosterPrefab);
            this._generalRosterNode.parent = this.node;
            this._generalRosterNode.zIndex = 4;
        } else {
            this._generalRosterNode.active = true;
        }

    }
    

    protected onOpenSkill(): void {
        console.log("onOpenSkill");
        if (this._skillNode == null) {
            this._skillNode = cc.instantiate(this.skillPrefab);
            this._skillNode.parent = this.node;
        } else {
            this._skillNode.active = true;
        }

    }
    


    //征收
    protected onCollection(msg:any):void{
        this.showTip("成功征收到 "+msg.gold+" 金币", null);
    }

    protected updateRole(): void {
        var roleData = LoginCommand.getInstance().proxy.getRoleData();
        this.nameLabel.string = "昵称: " + roleData.nickName;
        this.ridLabel.string = "角色ID: " + roleData.rid + "";
    }

    protected onClickCollection():void {
        if(this._collectNode == null){
            this._collectNode = cc.instantiate(this.collectPrefab);
            this._collectNode.parent = this.node;
        }
        this._collectNode.active = true;

    }

}
