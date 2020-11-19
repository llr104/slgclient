

/**设施*/
export class Facility {
    name: string = "";
    level:number = 0;
    type:number = 0;
}



/**设施(配置)*/
export class FacilityConfig {
    name: string = "";
    type:number = 0;
    mLevel:number = 0;
    json:any = {};
}




/**武将(配置)*/
export class GeneralConfig {
    name: string = "";
    cfgId:number = 0;
    force:number = 0;
    strategy:number = 0;
    defense:number = 0;
    speed:number = 0;
    destroy:number = 0;
    cost:number = 0;
    levels:any = {};
}






export default class MapUIProxy {
    protected _myFacility: any = new Map();//城市设施
    protected _facilityConfig:any = null;//设施配置
    protected _generalConfig:any = null;//武将配置
    protected _generalTex:any = new Map();//武将纹理
    protected _myGeneral:any = new Map();//我的武将
    protected _cityArmy:any = new Map();//城池军队配置



    /**
     * 当前城市的设施
     * @param data 
     */
    public setMyFacility(data:any):void {
        this._myFacility.clear();
        var cityId = data.cityId;
        var facilities = data.facilities;
        console.log("facilities:",facilities)
        if(facilities){
            var facilitiesArr = [];
            for(var i = 0;i < facilities.length;i++){
                var obj = new Facility();
                obj.name = facilities[i].name;
                obj.level = facilities[i].level;
                obj.type = facilities[i].type;
                facilitiesArr.push(obj);
            }
            this._myFacility.set(cityId,facilitiesArr);
        }
       

    }


    /**
     * 获取当前拥有的设施
     * @param cityId 
     */
    public getMyFacility(cityId:number = 0):Array<Facility>{
        return this._myFacility.get(cityId);
    }


    public setMyFacilityByCityId(cityId:number = 0,facilitiesArr:any):void{
        this._myFacility.set(cityId,facilitiesArr);
    }


    public getMyFacilityByType(cityId:number = 0,type:number = 0):any{
        var facility = this.getMyFacility(cityId);
        if(facility){
            for(var i = 0;i < facility.length;i++){
                if(type == facility[i].type){
                    return facility[i];
                }
            }
        }
        return null;
    }


    /**
     * 全部设施配置
     * @param jsonAsset 
     */
    public setAllFacilityCfg(jsonAsset:any):void{
        this._facilityConfig = new Map();
        
        var _facilityConfig = {};
        for(var i = 0;i < jsonAsset.length;i++){
            var asset = jsonAsset[i];
            _facilityConfig[asset._name] = asset.json;
        }


        for(var i = 0; i < _facilityConfig.facility.list.length;i++){
            var obj = new FacilityConfig();
            obj.type = _facilityConfig.facility.list[i].type;
            obj.name = _facilityConfig.facility.list[i].name;
            this._facilityConfig.set(obj.type,obj);
        }


        delete _facilityConfig["facility"];

        var facility:FacilityConfig = null;
        for(var key in _facilityConfig){
            var jsonData = _facilityConfig[key];
            if(jsonData.type != undefined){
                facility = this._facilityConfig.get(jsonData.type);
                facility.json = jsonData;
                facility.mLevel = jsonData.levels.length;

                this._facilityConfig.set(jsonData.type,facility);
            }

            else{
                for(var jsonKey in jsonData){
                    if(jsonKey == "title"){
                        continue;
                    }
                    facility = this._facilityConfig.get(jsonData[jsonKey].type);
                    facility.json = jsonData[jsonKey];
                    facility.mLevel = jsonData[jsonKey].levels.length;

                    this._facilityConfig.set(jsonData[jsonKey].type,facility);
                } 
            }
        }

        _facilityConfig = null;
        // console.log("this._facilityConfig:",this._facilityConfig);
    }


    public getFacilityCfgByType(type:number = 0):FacilityConfig{
        return this._facilityConfig.get(type);
    }



    /**
     * 武将配置
     * @param jsonAsset 
     */
    public setGeneralCfg(jsonAsset:any):void{
        this._generalConfig = new Map();
        var _generalConfig = {};

        // console.log("setGeneralCfg--asset:",jsonAsset);
        for(var i = 0;i < jsonAsset.length;i++){
            var asset = jsonAsset[i];
            _generalConfig[asset._name] = asset.json;
        }


        for(var i = 0;i<_generalConfig.general.list.length;i++){
            var obj = new GeneralConfig();
            obj.cfgId = _generalConfig.general.list[i].cfgId;
            obj.name = _generalConfig.general.list[i].name;
            obj.force = _generalConfig.general.list[i].force;
            obj.strategy = _generalConfig.general.list[i].strategy;
            obj.defense = _generalConfig.general.list[i].defense;
            obj.speed = _generalConfig.general.list[i].speed;
            obj.destroy = _generalConfig.general.list[i].destroy;
            obj.cost = _generalConfig.general.list[i].cost;
            obj.levels = _generalConfig.general_basic.levels;
            this._generalConfig.set(obj.cfgId,obj);
        }

        // console.log("this._generalConfig:",this._generalConfig);
    }


    /**
     * 获取武将配置
     */
    public getGeneralCfg():any{
        return this._generalConfig;
    }



    /**
     * 武将纹理
     * @param texAsset 
     */
    public setGenTex(texAsset:any):void{
        // console.log("setGenTex--asset:",texAsset);
        for(var i = 0;i < texAsset.length;i++){
            var asset = texAsset[i];
            var cfgId = asset._name.split("_")[1];
            cfgId = Number(cfgId);
            this._generalTex.set(cfgId,asset);
        }
    }



    public getGenTex(cfgId:number = 0):any{
        return this._generalTex.get(cfgId);
    }







    /**
     * 我拥有的武将
     * @param data 
     */
    public setMyGeneral(data:any):void{
        for(var i = 0;i < data.generals.length;i++){
            this._myGeneral.set(data.generals[i].cfgId,data.generals[i])
        }
    }



    public getMyGeneral(cfgId:number = 0):any{
        return this._myGeneral.get(cfgId);
    }



    /**
     * 城池军队配置
     * @param data 
     */
    public setCityArmy(data:any):void{
        this._cityArmy.set(data.cityId,data.armys?data.armys:[]);
    }

    public updateCityArmy(cityId:number = 0,army:any):void{
        var armys = this.getCityArmy(cityId);
        if(armys){
            if(armys.length > 0){
                for(var i = 0;i < armys.length;i++){
                    if(armys[i].id == army.id){
                        armys[i] = army;
                        break;
                    }
                }
            }else{
                armys.push(army);
            }
            
            this._cityArmy.set(cityId,armys);
        }
    }


    public getCityArmy(cityId:number = 0):any{
        return this._cityArmy.get(cityId);
    }

}