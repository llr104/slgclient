import { HttpManager } from "./scripts/network/http/HttpManager";
import { NetManager } from "./scripts/network/socket/NetManager";

var GameConfig = require("GameConfig");
var LoginProxy = require("LoginProxy");

const {ccclass, property} = cc._decorator;


@ccclass
export default class NewClass extends cc.Component {

    // @property(cc.Label)
    // label: cc.Label = null;

    // @property
    // text: string = 'hello';
    
    // @property(cc.Label)
    // labelName: cc.Label = null;

    // @property(cc.Label)
    // labelPass: cc.Label = null;

    // LIFE-CYCLE CALLBACKS:

    
    @property(cc.Prefab)
    loginPrefab: cc.Prefab = null;

    @property(cc.Prefab)
    createPrefab: cc.Prefab = null;

    // onLoad () {}

    start () {
        
        NetManager.getInstance().connect({url:GameConfig.serverUrl});
        HttpManager.getInstance().setWebUrl(GameConfig.webUrl);

        cc.systemEvent.on("create", this.create, this);
    }



    onclick(){
        var login = cc.instantiate(this.loginPrefab);
        login.parent = this.node;

    }

    create(){
        var create = cc.instantiate(this.createPrefab);
        create.parent = this.node;
    }
}
