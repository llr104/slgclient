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
        if (randomValue < 80) {
            randomLevel = 1;
        } else if (randomValue >= 80 && randomValue < 88) {
            randomLevel = 2;
        } else if (randomValue >= 88 && randomValue < 94) {
            randomLevel = 3;
        } else if (randomValue >= 94 && randomValue < 97) {
            randomLevel = 4;
        } else {
            randomLevel = 5;
        }
        return [randomType, randomLevel];
    }

    protected onClickMake(): void {
        this._mapSize = this.tiledMap.getMapSize();
        this._mapGroundIds = this.tiledMap.getLayer("obstruct").getTiles();
        var city_obstructIds = this.tiledMap.getLayer("city_obstruct").getTiles();


        let data: { w: number, h: number, list: any[] } = { w: 0, h: 0, list: null };
        this._resList = [];
        for (let i: number = 0; i < this._mapGroundIds.length; i++) {
            if (city_obstructIds[i] > 0) {
                this._resList.push([51, 1]);
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
       

        var city_position = this.tiledMap.getLayer("city_position").getTiles();
        var cp_list = [];
        for (let i: number = 0; i < city_position.length; i++) {
            if (city_position[i] > 0) {
                var obj = {x:0, y:0};
                obj.y = Math.ceil(i/data.w);
                obj.x = i%data.w;
                cp_list.push(obj);
            }
        }

        jsb.fileUtils.writeStringToFile(JSON.stringify(cp_list), path + "/city_postion.json");

        this.tipsLab.string = "生成成功";
    }
}
