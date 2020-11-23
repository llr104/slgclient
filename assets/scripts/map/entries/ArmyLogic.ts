import { ArmyData } from "../../general/ArmyProxy";
import DateUtil from "../../utils/DateUtil";
import MapUtil from "../MapUtil";

const { ccclass, property } = cc._decorator;

@ccclass
export default class ArmyLogic extends cc.Component {

    @property(cc.Animation)
    ani: cc.Animation = null;

    protected _data: ArmyData = null;
    protected _startX: number = 0;
    protected _startY: number = 0;
    protected _endX: number = 0;
    protected _endY: number = 0;
    protected _lenX: number = 0;
    protected _lenY: number = 0;

    protected onLoad(): void {

    }

    protected onDestroy(): void {
        this._data = null;
    }

    protected update(): void {
        if (this._data && this._data.state > 0) {
            let nowTime: number = DateUtil.getServerTime();
            // console.log("time1 ", nowTime);
            // console.log("time2 ", this._data.startTime * 1000);
            // console.log("time3 ", this._data.endTime * 1000);
            if (nowTime < this._data.endTime) {
                //代表移动中
                let percent: number = Math.max(0, (nowTime - this._data.startTime * 1000) / (this._data.endTime * 1000 - this._data.startTime * 1000));
                let nowX: number = this._startX + percent * this._lenX;
                let nowY: number = this._startY + percent * this._lenY;
                let pixelPos: cc.Vec2 = MapUtil.mapCellToPixelPoint(cc.v2(nowX, nowY));
                this.node.setPosition(pixelPos);
                
                // console.log("udpate Army pos", percent, nowX, nowY, pixelPos.x, pixelPos.y);
            } else {
                this.node.x = this._endX;
                this.node.y = this._endY;
            }
        }
    }

    public setArmyData(data: ArmyData): void {
        this._data = data;
        this._startX = this._data.fromX;
        this._startY = this._data.fromY;
        this._endX = this._data.toX;
        this._endY = this._data.toY;
        if (this._data.state == 3) {
            this._startX = this._data.toX;
            this._startY = this._data.toY;
            this._endX = this._data.fromX;
            this._endY = this._data.fromY;
        }
        this._lenX = this._endX - this._startX;
        this._lenY = this._endY - this._startY;
    }
}