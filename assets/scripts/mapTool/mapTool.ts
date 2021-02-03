const { ccclass, property } = cc._decorator;

@ccclass
export default class Helloworld extends cc.Component {

    @property(cc.TiledMap)
    tiledMap: cc.TiledMap = null;

    @property(cc.EditBox)
    editBox: cc.EditBox = null;

    @property(cc.Label)
    tipsLab: cc.Label = null;

    protected _mapSize: cc.Size = null;
    protected _mapGroundIds: number[] = null;
    protected _resList: any[] = null;

    protected onLoad(): void {
        console.log("tiledMap", this.tiledMap);
    }

    protected getRandomResData(): number[] {
        let randomType: number = Math.floor(Math.random() * 4) + 52;
        let randomValue: number = Math.floor(Math.random() * 100);
        let randomLevel: number = 1;
        if (randomValue < 50) {
            randomLevel = 1;
        } else if (randomValue >= 50 && randomValue < 70) {
            randomLevel = 2;
        } else if (randomValue >= 70 && randomValue < 85) {
            randomLevel = 3;
        } else if (randomValue >= 85 && randomValue < 92) {
            randomLevel = 4;
        } else if (randomValue >= 92 && randomValue < 98) {
            randomLevel = 5;
        }else {
            randomType = 56;
            randomLevel = 5;
        }
        return [randomType, randomLevel];
    }

    protected onClickMake(): void {
        this._mapSize = this.tiledMap.getMapSize();
        this._mapGroundIds = this.tiledMap.getLayer("obstruct").getTiles();
        var city_positionIds = this.tiledMap.getLayer("city_position").getTiles();


        let data: { w: number, h: number, list: any[] } = { w: 0, h: 0, list: null };
        this._resList = [];
        for (let i: number = 0; i < this._mapGroundIds.length; i++) {
            if (city_positionIds[i] > 0) {
                var num = Math.floor((Math.random()*10)+1);
                this._resList.push([51, num]);
            } else if(this._mapGroundIds[i] > 0) {
                this._resList.push([0, 0]);
            }
            else {
                this._resList.push(this.getRandomResData());
            }
        }

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
        

        data.w = this._mapSize.width;
        data.h = this._mapSize.height;
        data.list = this._resList;
        jsb.fileUtils.writeStringToFile(JSON.stringify(data), path + "/mapRes_0.json");
       

        this.tipsLab.string = "生成成功";
    }
}
