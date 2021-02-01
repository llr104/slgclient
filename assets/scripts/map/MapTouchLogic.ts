import { MapBuildData } from "./MapBuildProxy";
import { MapCityData } from "./MapCityProxy";
import MapClickUILogic from "./MapClickUILogic";
import MapCommand from "./MapCommand";
import { MapResData, MapResType } from "./MapProxy";
import MapUtil from "./MapUtil";

const { ccclass, property } = cc._decorator;

@ccclass
export default class MapTouchLogic extends cc.Component {
    @property(cc.Prefab)
    clickUIPrefab: cc.Prefab = null;

    protected _cmd: MapCommand;
    protected _clickUINode: cc.Node = null;

    protected onLoad(): void {
        this._cmd = MapCommand.getInstance();
        cc.systemEvent.on("touch_map", this.onTouchMap, this);
        cc.systemEvent.on("move_map", this.onMoveMap, this);
    }

    protected onDestroy(): void {
        cc.systemEvent.targetOff(this);
        this._cmd = null;
        this._clickUINode = null;
    }

    protected onTouchMap(mapPoint: cc.Vec2, clickPixelPoint: cc.Vec2): void {
        console.log("点击区域 (" + mapPoint.x + "," + mapPoint.y + ")");
        this.removeClickUINode();
        if (MapUtil.isVaildCellPoint(mapPoint) == false) {
            console.log("点击到无效区域");
            return;
        }

        let cellId: number = MapUtil.getIdByCellPoint(mapPoint.x, mapPoint.y);
        let cityData: MapCityData = this._cmd.cityProxy.getCity(cellId);;
        if (cityData != null) {
            //代表点击的是城市
            clickPixelPoint = MapUtil.mapCellToPixelPoint(cc.v2(cityData.x, cityData.y));
            this.showClickUINode(cityData, clickPixelPoint);
            return;
        }

        let buildData: MapBuildData = this._cmd.buildProxy.getBuild(cellId);
        if (buildData != null) {
            if(buildData.isSysCity() == false){
                //代表点击被占领的区域
                console.log("点击被占领的区域", buildData);
                this.showClickUINode(buildData, clickPixelPoint);
                return;
            }
           
        }

        let resData: MapResData = this._cmd.proxy.getResData(cellId);
        if (resData.type > 0) {
            var temp = MapCommand.getInstance().proxy.getSysCityResData(resData.x, resData.y);
            if (temp){
                clickPixelPoint = MapUtil.mapCellToPixelPoint(cc.v2(temp.x, temp.y));
                this.showClickUINode(temp, clickPixelPoint);
                console.log("点击野外城池", temp);
            }else{
                this.showClickUINode(resData, clickPixelPoint);
                console.log("点击野外区域", resData);
            }
           
        } else {
            console.log("点击山脉河流区域");
        }
    }

    protected onMoveMap(): void {
        this.removeClickUINode();
    }

    public showClickUINode(data: any, pos: cc.Vec2): void {
        if (this._clickUINode == null) {
            this._clickUINode = cc.instantiate(this.clickUIPrefab);

        }
        this._clickUINode.parent = this.node;
        this._clickUINode.setPosition(pos);
        this._clickUINode.getComponent(MapClickUILogic).setCellData(data, pos);
    }

    public removeClickUINode(): void {
        if (this._clickUINode) {
            this._clickUINode.parent = null;
        }
    }
}