import { MapResType } from "../map/MapProxy";

const { ccclass, property } = cc._decorator;

@ccclass
export default class GeneralTool extends cc.Component {



    @property(cc.EditBox)
    editBox: cc.EditBox = null;

    @property(cc.Label)
    tipsLab: cc.Label = null;

    protected _mapSize: cc.Size = null;
    protected _mapGroundIds: number[] = null;
    protected _resList: any[] = null;

    protected onLoad(): void {
        
    }

    

    protected onClickMake(): void {
        
        if (this.editBox.string == ""){
            this.tipsLab.string = "请输入生成输出目录";
            return
        }

        if (!CC_JSB) {
            this.tipsLab.string = "请使用 Windows 模拟器运行";
            return
        }

        var path = this.editBox.string;
        if(jsb.fileUtils.isDirectoryExist(path) == false){
            this.tipsLab.string = "目录不存在";
            return
        }
        

        this.tipsLab.string = "生成成功";
    }
}
