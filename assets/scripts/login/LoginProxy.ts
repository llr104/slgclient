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

    private _token:string = null;

    public clear() {
        this._loginData = null;
        this._roleData = null;
        this._roleResData = null;
        this._token = ""
    }


    public saveEnterData(data:any):void{
        if(data.role){
            this.setRoleData(data.role);
        }
        
        if(data.role_res){
            this.setRoleResData(data.role_res);
        }
        
        if(data.token){
            this._token = data.token
        }
        
    }

    public setRoleResData(data:any):void{
        this._roleResData = data;
    }


    public setRoleData(data:any):void{
        if(!this._roleData){
            this._roleData = new Role();
        }
        this._roleData.rid = data.rid;
        this._roleData.uid = data.uid;
        this._roleData.nickName = data.nickName;
        this._roleData.sex = data.sex;
        this._roleData.sid = data.sid;
        this._roleData.balance = data.balance;
        this._roleData.headId = data.headId;
        this._roleData.profile = data.profile;
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

    public getToken():string{
        return this._token;
    }

    public getSession():string{
        return this._loginData.session;
    }
}
