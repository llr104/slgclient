// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html



/**军队命令*/
export class GeneralItemType {
    static GeneralInfo: number = 0;//武将详情
    static GeneralDispose: number = 1;//武将上阵
    static GeneralConScript: number = 2;//武将征兵
    static GeneralNoThing: number = 3;//无用
    static GeneralSelect: number = 4;//选择
}


import GeneralCommand from "../../general/GeneralCommand";
import { GeneralCampType, GeneralConfig, GeneralData } from "../../general/GeneralProxy";


const { ccclass, property } = cc._decorator;

@ccclass
export default class GeneralRosterLogic extends cc.Component {


    @property(cc.Label)
    nameLabel: cc.Label = null;


    @property(cc.Sprite)
    spritePic:cc.Sprite = null;

    @property(cc.Label)
    costLabel: cc.Label = null;

    
    @property(cc.Layout)
    starLayout:cc.Layout = null;

    
    @property(cc.Label)
    campLabel: cc.Label = null;
    

    _cfg:GeneralConfig = null;

    public setData(cfg:GeneralConfig): void{
        this.updateItem(cfg);
    }

    protected updateItem(cfg:GeneralConfig):void{
        // console.log("updateItem");
        this._cfg = cfg;
        this.nameLabel.string = this._cfg.name 
        this.spritePic.spriteFrame = GeneralCommand.getInstance().proxy.getGeneralTex(this._cfg.cfgId);
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
        
    }


    protected showStar(star:number = 3,star_lv:number = 0):void{
        var childen = this.starLayout.node.children;
        for(var i = 0;i<childen.length;i++){
            if(i < star){
                childen[i].active = true;
                if(i < star_lv){
                    childen[i].color = cc.color(255,0,0);
                }else{
                    childen[i].color = cc.color(255,255,255);
                }
            }else{
                childen[i].active = false; 
            }
        }
    }

}
