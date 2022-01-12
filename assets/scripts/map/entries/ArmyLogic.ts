import { ArmyData } from "../../general/ArmyProxy";
import DateUtil from "../../utils/DateUtil";
import MapUtil from "../MapUtil";
import { Vec2, Node, Animation, Vec3, UITransform } from "cc";

export default class ArmyLogic {
    public data: ArmyData = null;
    public aniNode: Node = null;
    public arrowNode: Node = null;

    protected _parentLayer: Node;

    protected _aniName: string = "";
    protected _startPixelPos: Vec3 = new Vec3(0, 0, 0);
    protected _endPixelPos: Vec3 = new Vec3(0, 0, 0);
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

    public update(): Vec2 {
        if (this.data && this.data.state > 0) {
            let nowTime: number = DateUtil.getServerTime();
            if (nowTime < this.data.endTime) {
                //代表移动中
                let percent: number = Math.max(0, (nowTime - this.data.startTime) / (this.data.endTime - this.data.startTime));
               
                let pos = this.aniNode.position.clone();
                pos.x = this._startPixelPos.x + percent * this._lenX;
                pos.y = this._startPixelPos.y + percent * this._lenY;
                this.aniNode.setPosition(pos);

                let cellPoint: Vec2 = MapUtil.mapPixelToCellPoint(new Vec2(pos.x, pos.y));
                this.data.x = cellPoint.x;
                this.data.y = cellPoint.y;
            } else {
                this.aniNode.setPosition(this._endPixelPos);
                this.data.x = this.data.toX;
                this.data.y = this.data.toY;
            }
            this.updateArrow();
            return new Vec2(this.data.x, this.data.y);
        }
        return null;
    }

    protected updateArrow(): void {
        this.arrowNode.active = this.data && this.data.state > 0;
        if (this.arrowNode.active == true) {
        
            this.arrowNode.setPosition(this.aniNode.getPosition());
            let len: number = Math.sqrt(
                Math.abs((this._endPixelPos.y - this.arrowNode.position.y) * (this._endPixelPos.y - this.arrowNode.position.y))
                + Math.abs((this._endPixelPos.x - this.arrowNode.position.x) * (this._endPixelPos.x - this.arrowNode.position.x)));
            let angle: number = Math.atan2(this._endPixelPos.y - this.arrowNode.position.y, this._endPixelPos.x - this.arrowNode.position.x);
            this.arrowNode.angle = angle * 180 / Math.PI + 90;
            this.arrowNode.getComponent(UITransform).height = len;
        }
    }

    public setArmyData(data: ArmyData, aniNode: Node, arrowNode: Node): void {
        this.data = data;
        this.aniNode = aniNode;
        this.arrowNode = arrowNode;

        let startPos:Vec2 = MapUtil.mapCellToPixelPoint(new Vec2(this.data.fromX, this.data.fromY));
        this._startPixelPos.x = startPos.x;
        this._startPixelPos.y = startPos.y;

        let endPos:Vec2 = MapUtil.mapCellToPixelPoint(new Vec2(this.data.toX, this.data.toY));
        this._endPixelPos.x = endPos.x;
        this._endPixelPos.y = endPos.y;

        this._lenX = this._endPixelPos.x - this._startPixelPos.x;
        this._lenY = this._endPixelPos.y - this._startPixelPos.y;

        let pos = MapUtil.mapCellToPixelPoint(new Vec2(this.data.x, this.data.y));
        this.aniNode.setPosition(new Vec3(pos.x, pos.y, 0));

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

        this.aniNode.getComponent(Animation).play(this._aniName);

        this.updateArrow();
    }
}
