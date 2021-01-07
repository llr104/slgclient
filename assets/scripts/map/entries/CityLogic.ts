import DateUtil from "../../utils/DateUtil";
import { MapCityData } from "../MapCityProxy";
import MapCommand from "../MapCommand";

const { ccclass, property } = cc._decorator;

@ccclass
export default class CityLogic extends cc.Component {
    @property(cc.Label)
    labelName: cc.Label = null;
    @property(cc.Sprite)
    spr: cc.Sprite = null;
    @property(cc.SpriteAtlas)
    buildAtlas: cc.SpriteAtlas = null;
    @property(cc.Node)
    tipNode: cc.Node = null;

    @property(cc.Node)
    mianNode: cc.Node = null;

    protected _data: MapCityData = null;
    protected _limitTime: number = 0;

    protected onLoad(): void {
        this._limitTime = MapCommand.getInstance().proxy.getWarFree();
    }

    protected onDestroy(): void {
        this._data = null;
    }

    protected onEnable(): void {
        cc.systemEvent.on("unionChange", this.onUnionChange, this);
    }

    protected onDisable(): void {
        cc.systemEvent.targetOff(this);
    }

    protected onUnionChange(rid: number, unionId: number, parentId: number): void {
        if (this._data.rid == rid ){
            this._data.unionId = unionId;
            this._data.parentId = parentId;
        }
        this.updateUI();
    }

    public setCityData(data: MapCityData): void {
        this._data = data;
        console.log("setCityData:", data);
        this.updateUI();
    }

    public updateUI(): void {
        if (this._data) {
            this.labelName.string = this._data.name;
            if (this._data.rid == MapCommand.getInstance().cityProxy.myId) {
                this.tipNode.color = cc.Color.GREEN;
            } else if (this._data.unionId > 0 && this._data.unionId == MapCommand.getInstance().cityProxy.myUnionId) {
                this.tipNode.color = cc.Color.BLUE;
            } else if (this._data.unionId > 0 && this._data.unionId == MapCommand.getInstance().cityProxy.myParentId) {
                this.tipNode.color = cc.Color.MAGENTA;
            }else if (this._data.parentId > 0 && this._data.parentId == MapCommand.getInstance().cityProxy.myUnionId) {
                this.tipNode.color = cc.Color.YELLOW;
            }else {
                this.tipNode.color = cc.Color.RED;
            }

            var diff = DateUtil.getServerTime() - this._data.occupyTime;
            console.log("diff", diff, this._limitTime);
            if (this._data.parentId > 0 && diff<this._limitTime){
                this.mianNode.active = true;
                this.stopCountDown();
                this.schedule(this.countDown, 1.0);
            }else{
                this.mianNode.active = false;
            }
        }
    }

    public countDown() {
        var diff = DateUtil.getServerTime() - this._data.occupyTime;
        if (diff>this._limitTime){
            this.stopCountDown();
            this.mianNode.active = false;
        }
    }

    public stopCountDown() {
        this.unscheduleAllCallbacks();
    }
}