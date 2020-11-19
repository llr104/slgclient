export default class LoginProxy {
    //登录数据
    private _loginData: any = null;
    public serverId:number = 0;


    //角色数据
    private _roleData :any = null;

    //角色资源
    private _roleResData:any = null;
    public clear() {
        this._loginData = null;
        this._roleData = null;
        this._roleResData = null;
    }


    public saveEnterData(data:any):void{
        if(data.role){
            this._roleData = data.role;
        }
        
        if(data.role_res){
            this._roleResData = data.role_res;
        }
        
    }


    public getRoleData():any{
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