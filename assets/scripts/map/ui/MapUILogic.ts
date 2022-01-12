import { _decorator, Component, Prefab, Node, Layout, Label, instantiate, UITransform } from 'cc';
const { ccclass, property } = _decorator;

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
import { GeneralData } from "../../general/GeneralProxy";
import SkillLogic from "./SkillLogic";
import { SkillConf } from "../../config/skill/Skill";
import SkillInfoLogic from "./SkillInfoLogic";
import { EventMgr } from '../../utils/EventMgr';



@ccclass('MapUILogic')
export default class MapUILogic extends Component {

    @property(Node)
    contentNode:Node = null;

    @property(Prefab)
    facilityPrefab: Prefab = null;
    protected _facilityNode: Node = null;

    @property(Prefab)
    armySettingPrefab: Prefab = null;
    protected _armySettingNode: Node = null;

    @property(Prefab)
    dialog: Prefab = null;
    protected _dialogNode: Node = null;

    @property(Prefab)
    generalPrefab: Prefab = null;
    protected _generalNode: Node = null;

    @property(Prefab)
    generalDesPrefab: Prefab = null;
    protected _generalDesNode: Node = null;

    @property(Prefab)
    cityAboutPrefab: Prefab = null;
    protected _cityAboutNode: Node = null;

    @property(Prefab)
    fortressAboutPrefab: Prefab = null;
    protected _fortressAboutNode: Node = null;

    @property(Prefab)
    warReportPrefab: Prefab = null;
    protected _warReportNode: Node = null;
    @property(Prefab)
    armySelectPrefab: Prefab = null;
    protected _armySelectNode: Node = null;

    @property(Prefab)
    drawPrefab: Prefab = null;
    protected _drawNode: Node = null;

    @property(Prefab)
    drawResultrefab: Prefab = null;
    protected _drawResultNode: Node = null;
    
    @property(Prefab)
    unionPrefab: Prefab = null;
    protected _unionNode: Node = null;

    @property(Prefab)
    chatPrefab: Prefab = null;
    protected _chatNode: Node = null;

    @property(Prefab)
    collectPrefab: Prefab = null;
    protected _collectNode: Node = null;


    @property(Prefab)
    transFormPrefab: Prefab = null;
    protected _transFormNode: Node = null;

    @property(Prefab)
    generalConvertPrefab: Prefab = null;
    protected _generalConvertNode: Node = null;

    @property(Prefab)
    generalRosterPrefab: Prefab = null;
    protected _generalRosterNode: Node = null;

    @property(Prefab)
    skillPrefab: Prefab = null;
    protected _skillNode: Node = null;

    @property(Prefab)
    skillInfoPrefab: Prefab = null;
    protected _skillInfoNode: Node = null;

    @property(Node)
    widgetNode: Node = null;

    @property(Layout)
    srollLayout: Layout = null;

    @property(Label)
    nameLabel: Label = null;

    @property(Label)
    ridLabel: Label = null;

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


        EventMgr.on("open_city_about", this.openCityAbout, this);
        EventMgr.on("close_city_about", this.closeCityAbout, this);

        EventMgr.on("open_fortress_about", this.openFortressAbout, this);
        EventMgr.on("open_facility", this.openFacility, this);


        EventMgr.on("open_army_setting", this.openArmySetting, this);
        EventMgr.on("upate_my_roleRes", this.updateRoleRes, this);
        EventMgr.on("open_general_des", this.openGeneralDes, this);
        EventMgr.on("open_general_choose", this.openGeneralChoose, this);
        EventMgr.on("open_army_select_ui", this.onOpenArmySelectUI, this);
        EventMgr.on("open_draw_result", this.openDrawR, this);
        EventMgr.on("robLoginUI", this.robLoginUI, this);
        EventMgr.on("interior_collect", this.onCollection, this);
        EventMgr.on("open_general_convert", this.onOpenGeneralConvert, this);
        EventMgr.on("open_general_roster", this.onOpenGeneralRoster, this);
        EventMgr.on("open_general", this.openGeneral, this);
        EventMgr.on("open_skill", this.onOpenSkill, this);
        EventMgr.on("close_skill", this.onCloseSkill, this);
        EventMgr.on("open_skillInfo", this.onOpenSkillInfo, this);
        
        

        this.updateRoleRes();
        this.updateRole();
        let unionId = MapCommand.getInstance().cityProxy.myUnionId;
        if (unionId > 0) {
            UnionCommand.getInstance().unionApplyList(unionId);
        }
    }

    protected robLoginUI(): void {
        this.showTip("账号在其他地方登录",function () {
            EventMgr.emit("enter_login");
        });
    }

    protected showTip(text:string, close:Function):void {
        if (this._dialogNode == null){
            this._dialogNode = instantiate(this.dialog)
            this._dialogNode.parent = this.contentNode;
        }else{
            this._dialogNode.active = true;
        }
        this._dialogNode.setSiblingIndex(this.topLayer());
        this._dialogNode.getComponent(Dialog).text(text);
        this._dialogNode.getComponent(Dialog).setClose(close)
    }


    protected onDestroy(): void {
        this.clearAllNode();
        MapUICommand.getInstance().proxy.clearData();
        EventMgr.targetOff(this);

        console.log("MapUILogic onDestroy")
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



    public topLayer():number {
        return this.contentNode.children.length+1;
    }
    /**
     * 设施
     */
    protected openFacility(data: any): void {
        if (this._facilityNode == null) {
            this._facilityNode = instantiate(this.facilityPrefab);
            this._facilityNode.parent = this.contentNode;
        } else {
            this._facilityNode.active = true;
        }
        this._facilityNode.setSiblingIndex(this.topLayer());
        this._facilityNode.getComponent(FacilityListLogic).setData(data);
    }

    protected openArmySetting(cityId: number, order: number): void {
        if (this._armySettingNode == null) {
            this._armySettingNode = instantiate(this.armySettingPrefab);
            this._armySettingNode.parent = this.contentNode;
        } else {
            this._armySettingNode.active = true;
        }
        this._armySettingNode.setSiblingIndex(this.topLayer());
        this._armySettingNode.getComponent(CityArmySettingLogic).setData(cityId, order);
    }
    /**
     * 武将
     */
    protected openGeneral(data: number[], type: number = 0, position: number = 0, zIndex: number = 0): void {
        if (this._generalNode == null) {
            this._generalNode = instantiate(this.generalPrefab);
            this._generalNode.parent = this.contentNode;
        } else {
            this._generalNode.active = true;
        }
        this._generalNode.setSiblingIndex(this.topLayer());
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
            this._armySelectNode = instantiate(this.armySelectPrefab);
            this._armySelectNode.parent = this.node;
        } else {
            this._armySelectNode.active = true;
        }
        this._armySelectNode.setSiblingIndex(this.topLayer());
        this._armySelectNode.getComponent(ArmySelectNodeLogic).setData(cmd, x, y);
    }


    /**
     * 武将详情
     */
    protected openGeneralDes(cfgData: any, curData: any): void {
        if (this._generalDesNode == null) {
            this._generalDesNode = instantiate(this.generalDesPrefab);
            this._generalDesNode.parent = this.contentNode;
        } else {
            this._generalDesNode.active = true;
        }
        this._generalDesNode.setSiblingIndex(this.topLayer());
        this._generalDesNode.getComponent(GeneralInfoLogic).setData(cfgData, curData);
    }


    /**
     * 城市
     */
    protected openCityAbout(data: any): void {
        if (this._cityAboutNode == null) {
            this._cityAboutNode = instantiate(this.cityAboutPrefab);
            this._cityAboutNode.parent = this.contentNode;
        } else {
            this._cityAboutNode.active = true;
        }

        this._cityAboutNode.setSiblingIndex(this.topLayer());
        this.widgetNode.active = false;
        EventMgr.emit("scroll_to_map", data.x, data.y);
        this._cityAboutNode.getComponent(CityAboutLogic).setData(data);
    }

    protected closeCityAbout(): void {
        this.widgetNode.active = true;
    }
    
    protected openFortressAbout(data: any): void {
        if (this._fortressAboutNode == null) {
            this._fortressAboutNode = instantiate(this.fortressAboutPrefab);
            this._fortressAboutNode.parent = this.contentNode;
        } else {
            this._fortressAboutNode.active = true;
        }
        this._fortressAboutNode.setSiblingIndex(this.topLayer());
        this._fortressAboutNode.getComponent(FortressAbout).setData(data);
    }

    

    /**
     * 战报
     */
    protected openWarReport(): void {
        if (this._warReportNode == null) {
            this._warReportNode = instantiate(this.warReportPrefab);
            this._warReportNode.parent = this.contentNode;
        } else {
            this._warReportNode.active = true;
        }
        this._warReportNode.setSiblingIndex(this.topLayer());
        this._warReportNode.getComponent(WarReportLogic).updateView();
    }

    /**
     * 角色信息
     */
    protected updateRoleRes(): void {
        var children = this.srollLayout.node.children;
        var roleRes = LoginCommand.getInstance().proxy.getRoleResData();

        var i = 0;
        children[i].getChildByName("New Label").getComponent(Label).string = "令牌:" + Tools.numberToShow(roleRes["decree"]);
        i+=1;
        

        for (let index = 0; index < this._resArray.length; index++) {
            const obj = this._resArray[index];
            var label = children[i].getChildByName("New Label").getComponent(Label)

            if(obj.key == "gold"){
                label.string = obj.name + Tools.numberToShow(roleRes[obj.key]);
            }else{
                label.string = obj.name + Tools.numberToShow(roleRes[obj.key]) + "/" + Tools.numberToShow(roleRes["depot_capacity"]);
            }
            
            i+=1;
        }

        for (let index = 0; index < this._yieldArray.length; index++) {
            const obj = this._yieldArray[index];
            var label = children[i].getChildByName("New Label").getComponent(Label)
            label.string = obj.name + Tools.numberToShow(roleRes[obj.key]);
            i+=1;
        }

    }



    /**
     * 抽卡
     */
    protected openDraw(): void {
        if (this._drawNode == null) {
            this._drawNode = instantiate(this.drawPrefab);
            this._drawNode.parent = this.contentNode;
        } else {
            this._drawNode.active = true;
        }
        this._drawNode.setSiblingIndex(this.topLayer());
    }




    /**
     * 抽卡结果
     * @param data 
     */
    protected openDrawR(data: any): void {
        if (this._drawResultNode == null) {
            this._drawResultNode = instantiate(this.drawResultrefab);
            this._drawResultNode.parent = this.contentNode;
        } else {
            this._drawResultNode.active = true;
        }
        this._drawResultNode.setSiblingIndex(this.topLayer());
        this._drawResultNode.getComponent(DrawRLogic).setData(data);

        console.log("openDrawR:", this.contentNode);
    }



    protected openUnion(): void {
        if (this._unionNode == null) {
            this._unionNode = instantiate(this.unionPrefab);
            this._unionNode.parent = this.contentNode;
        } else {
            this._unionNode.active = true;
        }
        this._unionNode.setSiblingIndex(this.topLayer());
    }


    protected openChat(): void {
        if (this._chatNode == null) {
            this._chatNode = instantiate(this.chatPrefab);
            this._chatNode.parent = this.contentNode;
        } else {
            this._chatNode.active = true;
        }
        this._chatNode.setSiblingIndex(this.topLayer());
    }



    protected openTr(): void {
        if (this._transFormNode == null) {
            this._transFormNode = instantiate(this.transFormPrefab);
            this._transFormNode.parent = this.contentNode;
        } else {
            this._transFormNode.active = true;
        }
        this._transFormNode.setSiblingIndex(this.topLayer());
        this._transFormNode.getComponent(TransformLogic).initView();
    }

    protected onOpenGeneralConvert(): void {
        console.log("onOpenGeneralConvert");
        if (this._generalConvertNode == null) {
            this._generalConvertNode = instantiate(this.generalConvertPrefab);
            this._generalConvertNode.parent = this.contentNode;
            
        } else {
            this._generalConvertNode.active = true;
        }

        this._generalConvertNode.setSiblingIndex(this.topLayer());

    }

    protected onOpenGeneralRoster(): void {
        console.log("onOpenGeneralRoster");
        if (this._generalRosterNode == null) {
            this._generalRosterNode = instantiate(this.generalRosterPrefab);
            this._generalRosterNode.parent = this.contentNode;
        } else {
            this._generalRosterNode.active = true;
        }
        this._generalRosterNode.setSiblingIndex(this.topLayer());

    }
    
    onClickSkillBtn(): void{
        this.onOpenSkill(0);
    }

    protected onOpenSkill(type:number=0, general:GeneralData = null, skillPos:number=-1): void {
        console.log("onOpenSkill", type, general, skillPos);
        if (this._skillNode == null) {
            this._skillNode = instantiate(this.skillPrefab);
            this._skillNode.parent = this.contentNode;
        } else {
            this._skillNode.active = true;
        }
        this._skillNode.setSiblingIndex(this.topLayer());
        this._skillNode.getComponent(SkillLogic).setData(type, general, skillPos);
    }

    protected onCloseSkill(){
        if (this._skillNode) {
           this._skillNode.active = false;
        } 
    }
    
    protected onOpenSkillInfo(cfg:SkillConf, type:number=0, general:GeneralData = null, skillPos:number=-1){
        console.log("onOpenSkillInfo", cfg, type, general, skillPos);
        if (this._skillInfoNode == null) {
            this._skillInfoNode = instantiate(this.skillInfoPrefab);
            this._skillInfoNode.parent = this.contentNode;
        } else {
            this._skillInfoNode.active = true;
        }
        this._skillInfoNode.setSiblingIndex(this.topLayer());
        this._skillInfoNode.getComponent(SkillInfoLogic).setData(cfg, type, general, skillPos);
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
            this._collectNode = instantiate(this.collectPrefab);
            this._collectNode.parent = this.contentNode;
        }
        this._collectNode.active = true;
        this._collectNode.setSiblingIndex(this.topLayer());

    }

}
