import { sys } from "cc";

export class LocalCache{
    public static userListKey = "userListKey";


    public static setPersonMemory(keyStr, Value):void {
        //log("setPersonMemory:" + keyStr + ", " + Value);
    
        if (keyStr === undefined || keyStr === null || keyStr === "") {
            return;
        }
    
        if (Value === undefined || Value === null || Value === "") {
            Value = false;
        }
    
        var jsonContent = LocalCache.getListForJson();
        if (jsonContent === undefined || jsonContent === null || jsonContent === "") {
            jsonContent = {};
        }
        jsonContent[keyStr] = Value;
    
        var jsonstring = JSON.stringify(jsonContent);
        sys.localStorage.setItem(LocalCache.userListKey, jsonstring);
    };



    
    public static getPersonMemory(keyStr, defaultValue):any {
        //log("getPersonMemory:" + keyStr + ", " + defaultValue);
    
        //key不存在就gg了
        if (keyStr === undefined || keyStr === null || keyStr === "") {
            return;
        }
    
        //获取本地已经保存的
        var jsonContent = LocalCache.getListForJson();
        if (jsonContent === null || jsonContent === undefined || jsonContent === "") {
            jsonContent = {};
        }
    
        
        //如果本身值存在就返回本身
        if (jsonContent[keyStr] !== null && jsonContent[keyStr] !== undefined && jsonContent[keyStr] !== "") {
            return jsonContent[keyStr];
        } else//如果本身不存在就判断默认是否存在
        {
            //默认也不存在 返回false
            if (defaultValue === undefined || defaultValue === null || defaultValue === "") {
                return false;
            } else {
                //默认存在  设置默认保存并且返回默认值
                jsonContent[keyStr] = defaultValue;
                var jsonstring = JSON.stringify(jsonContent);
                sys.localStorage.setItem(LocalCache.userListKey, jsonstring);
                return jsonContent[keyStr];
            }
        }
    
    }


    public static getListForJson():any {
        var jsondata = sys.localStorage.getItem(LocalCache.userListKey);
        if (0 == Number(jsondata) || jsondata == undefined)
            return;
    
        var jsonArray = JSON.parse(jsondata);
        return jsonArray;
    };


    public static getUuid():any{
        return LocalCache.getPersonMemory("deviceuuid", "");
    }
    
    public static setUuid(uuid):void {
        LocalCache.setPersonMemory("deviceuuid", uuid);
    };




    public static setLoginValidation(data:any):void{
        LocalCache.setPersonMemory("loginvalidation", data);
    }

    public static getLoginValidation():any{
        return LocalCache.getPersonMemory("loginvalidation", "");
    }


}
