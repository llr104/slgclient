import { ArmyData } from "../../general/ArmyProxy";
import DateUtil from "../../utils/DateUtil";
import MapUtil from "../MapUtil";

const { ccclass, property } = cc._decorator;

@ccclass
export default class ArmyLogic extends cc.Component {

    @property(cc.Animation)
    ani: cc.Animation = null;

    protected _data: ArmyData = null;
    protected _startPixelPos: cc.Vec2 = null;
    protected _endPixelPos: cc.Vec2 = null;
    protected _lenX: number = 0;
    protected _lenY: number = 0;

    protected onLoad(): void {

    }

    protected onDestroy(): void {
        this._data = null;
    }

    protected update(): void {
        if (this._data && this._data.state == 0) {
            let nowTime: number = DateUtil.getServerTime();
            if (nowTime < this._data.endTime) {
                //代表移动中
                let percent: number = Math.max(0, (nowTime - this._data.startTime) / (this._data.endTime - this._data.startTime));
                this.node.x = this._startPixelPos.x + percent * this._lenX;
                this.node.y = this._startPixelPos.y + percent * this._lenY;
                let cellPoint:cc.Vec2 = MapUtil.mapPixelToCellPoint(cc.v2(this.node.x, this.node.y));
                this._data.x =cellPoint.x;
                this._data.y = cellPoint.y;
            } else {
                this.node.setPosition(this._endPixelPos);
                this._data.x = this._data.toX;
                this._data.y = this._data.toY;
            }
        }
    }

    public setArmyData(data: ArmyData): void {
        this._data = data;
        if (this._data.state == 3) {
            this._startPixelPos =  MapUtil.mapCellToPixelPoint(cc.v2(this._data.toX, this._data.toY));
            this._endPixelPos =  MapUtil.mapCellToPixelPoint(cc.v2(this._data.fromX, this._data.fromY));
        } else {
            this._startPixelPos =  MapUtil.mapCellToPixelPoint(cc.v2(this._data.fromX, this._data.fromY));
            this._endPixelPos =  MapUtil.mapCellToPixelPoint(cc.v2(this._data.toX, this._data.toY));
        }
        this._lenX = this._endPixelPos.x - this._startPixelPos.x;
        this._lenY = this._endPixelPos.y - this._startPixelPos.y;
    }
}