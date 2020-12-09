import { ArmyData } from "../../general/ArmyProxy";
import DateUtil from "../../utils/DateUtil";
import MapUtil from "../MapUtil";

const { ccclass, property } = cc._decorator;

@ccclass
export default class ArmyLogic extends cc.Component {

    @property(cc.Prefab)
    aniPrefab: cc.Prefab = null;

    protected _data: ArmyData = null;
    protected _aniNode: cc.Node = null;
    protected _aniName: string = "";
    protected _startPixelPos: cc.Vec2 = null;
    protected _endPixelPos: cc.Vec2 = null;
    protected _lenX: number = 0;
    protected _lenY: number = 0;

    protected onLoad(): void {
        this._aniNode = cc.instantiate(this.aniPrefab);
        this._aniNode.parent = this.node;
    }

    protected onDestroy(): void {
        this._data = null;
        this._aniNode = null;
    }

    protected onEnable():void {
        cc.systemEvent.on("my_union_change", this.onUnionChange, this);
    }

    protected onDisable():void {
        cc.systemEvent.targetOff(this);
    }

    protected onUnionChange(rid:number, cityId:number, isMine:boolean):void {
        if (isMine || cityId == this._data.cityId) {
            this.setArmyData(this._data);
        }
    }

    protected update(): void {
        if (this._data && this._data.state > 0) {
            let nowTime: number = DateUtil.getServerTime();
            if (nowTime < this._data.endTime) {
                //代表移动中
                let percent: number = Math.max(0, (nowTime - this._data.startTime) / (this._data.endTime - this._data.startTime));
                this.node.x = this._startPixelPos.x + percent * this._lenX;
                this.node.y = this._startPixelPos.y + percent * this._lenY;
                let cellPoint: cc.Vec2 = MapUtil.mapPixelToCellPoint(cc.v2(this.node.x, this.node.y));
                this._data.x = cellPoint.x;
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
        this._startPixelPos = MapUtil.mapCellToPixelPoint(cc.v2(this._data.fromX, this._data.fromY));
        this._endPixelPos = MapUtil.mapCellToPixelPoint(cc.v2(this._data.toX, this._data.toY));
        this._lenX = this._endPixelPos.x - this._startPixelPos.x;
        this._lenY = this._endPixelPos.y - this._startPixelPos.y;
        this.node.setPosition(MapUtil.mapCellToPixelPoint(cc.v2(this._data.x, this._data.y)));
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
        this._aniNode.getComponent(cc.Animation).play(this._aniName);
    }
}