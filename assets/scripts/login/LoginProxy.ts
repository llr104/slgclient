

export class Role{
    rid:number = 0;
    uid:number = 0;
    nickName:string = "";
    sex:number = 0;
    sid:number = 0;
    balance:number = 0;
    headId:number = 0;
    profile:string = "";
}



export default class LoginProxy {
    //登录数据
    private _loginData: any = null;
    public serverId:number = 0;


    //角色数据
    private _roleData :Role = null;

    //角色资源
    private _roleResData:any = null;
    public clear() {
        this._loginData = null;
        this._roleData = null;
        this._roleResData = null;
    }


    public saveEnterData(data:any):void{
        if(data.role){
            if(!this._roleData){
                this._roleData = new Role();
            }
            this._roleData.rid = data.role.rid;
            this._roleData.uid = data.role.uid;
            this._roleData.nickName = data.role.nickName;
            this._roleData.sex = data.role.sex;
            this._roleData.sid = data.role.sid;
            this._roleData.balance = data.role.balance;
            this._roleData.headId = data.role.headId;
            this._roleData.profile = data.role.profile;

        }
        
        if(data.role_res){
            this._roleResData = data.role_res;
        }
        
    }


    public getRoleData():Role{
        return this._roleData;
    }


    public getRoleResData():any{
        return this._roleResData;
    }


    public saveLoginData(data:any):void{
        this._loginData = data;
    }

    public getLoginData():any{
        return this._loginData;
    }
}