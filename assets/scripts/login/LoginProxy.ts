export default class LoginProxy {
    //登录数据
    public loginData: any = null;
    public serverId:number = 1;
    public clear() {
        this.loginData = null;
    }
}