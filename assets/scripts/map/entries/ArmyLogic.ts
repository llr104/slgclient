import { ArmyData } from "../../general/ArmyProxy";
import DateUtil from "../../utils/DateUtil";
import MapUtil from "../MapUtil";

export default class ArmyLogic {
    public data: ArmyData = null;
    public aniNode: cc.Node = null;
    public arrowNode: cc.Node = null;

    protected _parentLayer: cc.Node;

    protected _aniName: string = "";
    protected _startPixelPos: cc.Vec2 = null;
    protected _endPixelPos: cc.Vec2 = null;
    protected _lenX: number = 0;
    protected _lenY: number = 0;

    public clear() {
        this.data = null;
        this.aniNode = null;
        this.arrowNode = null;
        this._parentLayer = null;
    }

    public destroy(): void {
        this.aniNode.parent = null;
        this.arrowNode.parent = null;
        this.clear();
    }

    public update(): cc.Vec2 {
        if (this.data && this.data.state > 0) {
            let nowTime: number = DateUtil.getServerTime();
            if (nowTime < this.data.endTime) {
                //代表移动中
                let percent: number = Math.max(0, (nowTime - this.data.startTime) / (this.data.endTime - this.data.startTime));
                this.aniNode.x = this._startPixelPos.x + percent * this._lenX;
                this.aniNode.y = this._startPixelPos.y + percent * this._lenY;
                let cellPoint: cc.Vec2 = MapUtil.mapPixelToCellPoint(cc.v2(this.aniNode.x, this.aniNode.y));
                this.data.x = cellPoint.x;
                this.data.y = cellPoint.y;
            } else {
                this.aniNode.setPosition(this._endPixelPos);
                this.data.x = this.data.toX;
                this.data.y = this.data.toY;
            }
            this.updateArrow();
            return cc.v2(this.data.x, this.data.y);
        }
        return null;
    }

    protected updateArrow(): void {
        this.arrowNode.active = this.data && this.data.state > 0;
        if (this.arrowNode.active == true) {
            this.arrowNode.x = this.aniNode.x;
            this.arrowNode.y = this.aniNode.y;
            let len: number = Math.sqrt(
                Math.abs((this._endPixelPos.y - this.arrowNode.y) * (this._endPixelPos.y - this.arrowNode.y))
                + Math.abs((this._endPixelPos.x - this.arrowNode.x) * (this._endPixelPos.x - this.arrowNode.x)));
            let angle: number = Math.atan2(this._endPixelPos.y - this.arrowNode.y, this._endPixelPos.x - this.arrowNode.x);
            this.arrowNode.angle = angle * 180 / Math.PI + 90;
            this.arrowNode.height = len;
        }
    }

    public setArmyData(data: ArmyData, aniNode: cc.Node, arrowNode: cc.Node): void {
        this.data = data;
        this.aniNode = aniNode;
        this.arrowNode = arrowNode;

        this._startPixelPos = MapUtil.mapCellToPixelPoint(cc.v2(this.data.fromX, this.data.fromY));
        this._endPixelPos = MapUtil.mapCellToPixelPoint(cc.v2(this.data.toX, this.data.toY));
        this._lenX = this._endPixelPos.x - this._startPixelPos.x;
        this._lenY = this._endPixelPos.y - this._startPixelPos.y;
        this.aniNode.setPosition(MapUtil.mapCellToPixelPoint(cc.v2(this.data.x, this.data.y)));
        this._aniName = "qb_run_r";
        if (this._startPixelPos.y == this._endPixelPos.y) {
            //平行
            if (this._startPixelPos.x < this._endPixelPos.x) {
                this._aniName = "qb_run_r";
            } else {
                this._aniName = "qb_run_l";
            }
        } else if (this._startPixelPos.y < this._endPixelPos.y) {
            //往上走
            if (this._startPixelPos.x < this._endPixelPos.x) {
                this._aniName = "qb_run_ru";
            } else if (this._startPixelPos.x == this._endPixelPos.x) {
                this._aniName = "qb_run_u";
            } else {
                this._aniName = "qb_run_lu";
            }
        } else if (this._startPixelPos.y > this._endPixelPos.y) {
            //往下走
            if (this._startPixelPos.x < this._endPixelPos.x) {
                this._aniName = "qb_run_rd";
            } else if (this._startPixelPos.x == this._endPixelPos.x) {
                this._aniName = "qb_run_d";
            } else {
                this._aniName = "qb_run_ld";
            }
        }
        this.aniNode.getComponent(cc.Animation).play(this._aniName);

        this.updateArrow();
    }
}