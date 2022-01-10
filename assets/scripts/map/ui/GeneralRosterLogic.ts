import { _decorator, Component, Label, Sprite, Layout, color } from 'cc';
const { ccclass, property } = _decorator;

import { GeneralCampType, GeneralConfig } from "../../general/GeneralProxy";
import GeneralHeadLogic from "./GeneralHeadLogic";


// /**军队命令*/
export class GeneralItemType {
    static GeneralInfo: number = 0;//武将详情
    static GeneralDispose: number = 1;//武将上阵
    static GeneralConScript: number = 2;//武将征兵
    static GeneralNoThing: number = 3;//无用
    static GeneralSelect: number = 4;//选择
}


@ccclass('GeneralRosterLogic')
export default class GeneralRosterLogic extends Component {


    @property(Label)
    nameLabel: Label = null;


    @property(Sprite)
    spritePic:Sprite = null;

    @property(Label)
    costLabel: Label = null;

    
    @property(Layout)
    starLayout:Layout = null;

    
    @property(Label)
    campLabel: Label = null;

    @property(Label)
    armLabel: Label = null;

    _cfg:GeneralConfig = null;

    public setData(cfg:GeneralConfig): void{
        this.updateItem(cfg);
    }

    protected updateItem(cfg:GeneralConfig):void{
        // console.log("updateItem");
        this._cfg = cfg;
        this.nameLabel.string = this._cfg.name 
        this.spritePic.getComponent(GeneralHeadLogic).setHeadId(this._cfg.cfgId);
        this.showStar(this._cfg.star, 0);
        
        if(this.costLabel){
            this.costLabel.string = this._cfg.cost + "";
        }

        if(this._cfg.camp == GeneralCampType.Han){
            this.campLabel.string = "汉";
        }else if(this._cfg.camp == GeneralCampType.Qun){
            this.campLabel.string = "群";
        }else if(this._cfg.camp == GeneralCampType.Wei){
            this.campLabel.string = "魏";
        }else if(this._cfg.camp == GeneralCampType.Shu){
            this.campLabel.string = "蜀";
        }else if(this._cfg.camp == GeneralCampType.Wu){
            this.campLabel.string = "吴";
        }

        this.armLabel.string = this.armstr(this._cfg.arms);
        
    }


    protected showStar(star:number = 3,star_lv:number = 0):void{
        var childen = this.starLayout.node.children;
        for(var i = 0;i<childen.length;i++){
            if(i < star){
                childen[i].active = true;
                if(i < star_lv){
                    childen[i].getComponent(Sprite).color = color(255,0,0);
                }else{
                    childen[i].getComponent(Sprite).color = color(255,255,255);
                }
            }else{
                childen[i].active = false; 
            }
        }
    }

    protected armstr(arms:number []): string{
        // console.log("armstr:", arms);

        var str = ""
        if(arms.indexOf(1)>=0 || arms.indexOf(4)>=0 || arms.indexOf(7)>=0){
            str += "步"
        }else if(arms.indexOf(2)>=0 || arms.indexOf(5)>=0 || arms.indexOf(8)>=0){
            str += "弓"
        }else if(arms.indexOf(3)>=0 || arms.indexOf(6)>=0 || arms.indexOf(9)>=0){
            str += "骑"
        }
        return str;
    }


}
