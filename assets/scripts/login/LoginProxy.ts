export default class LoginProxy {
    //登录数据
    public loginData: any = null;
    public serverId:number = 0;


    //角色数据
    public enterServerData :any = null;

    //角色资源
    public roleRes:any = null;
    public clear() {
        this.loginData = null;
        this.enterServerData = null;
        this.roleRes = null;
    }
}