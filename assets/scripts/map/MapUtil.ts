

export default class MapUtil {
    //地图像素大小
    protected static _mapPixelSize: cc.Size = null;
    //地图锚点偏移量
    protected static _mapOffsetPoint: cc.Vec2 = null;
    //格子大小
    protected static _tileSize: cc.Size = cc.size(256, 128);;
    //地图大小 宽高需要相同
    protected static _mapSize: cc.Size = cc.size(20, 20);
    //地图 (0, 0)点对应的像素坐标
    protected static _zeroPixelPoint: cc.Vec2 = cc.v2(0, 0);
    //划分区域的格子大小
    protected static _areaCellSize: cc.Size = null;
    protected static _areaSize: cc.Size = null;

    // 初始化地图配置
    public static initMapConfig(map: cc.TiledMap): void {
        this._mapPixelSize = cc.size(map.node.width, map.node.height);
        this._mapOffsetPoint = cc.v2(map.node.width * map.node.anchorX, map.node.height * map.node.anchorY);
        this._tileSize = map.getTileSize();
        this._mapSize = map.getMapSize();
        this._mapPixelSize = cc.size(map.node.width, map.node.height);
        this._zeroPixelPoint.x = this._mapSize.width * this._tileSize.width * 0.5;
        this._zeroPixelPoint.y = this._mapSize.height * this._tileSize.height - this._tileSize.height * 0.5;

        //划分区域的大小
        let showH: number = Math.min(Math.ceil(cc.game.canvas.height / this._tileSize.height / 2) * 2 + 2, this._mapSize.height);
        this._areaCellSize = cc.size(showH, showH);
        this._areaSize = cc.size(Math.ceil(this._mapSize.width / showH), Math.ceil(this._mapSize.height / showH));
    }

    /**地图的像素大小*/
    public static get mapPixcelSize(): cc.Size {
        return this._mapPixelSize;
    }

    public static get mapSize(): cc.Size {
        return this._mapSize;
    }

    /**格子数量*/
    public static get mapCellCount(): number {
        return this._mapSize.width * this._mapSize.height;
    }

    /**每个区域包含的格子数量*/
    public static get areaCellSize(): cc.Size {
        return this._areaCellSize;
    }

    /**区域大小*/
    public static get areaSize(): cc.Size {
        return this._areaSize;
    }

    /**区域数量*/
    public static get areaCount(): number {
        return this._areaSize.width * this._areaSize.height;
    }

    /**获取格子id*/
    public static getIdByCellPoint(x: number, y: number): number {
        return x + y * this._mapSize.width;
    }

    /**获取格子坐标*/
    public static getCellPointById(id: number): cc.Vec2 {
        return cc.v2(id % this._mapSize.width, Math.floor(id / this._mapSize.width));
    }

    /**获取区域id*/
    public static getIdByAreaPoint(x: number, y: number): number {
        return x + y * this._areaSize.width;
    }

    /**获取区域坐标*/
    public static getAreaPointById(id: number): cc.Vec2 {
        return cc.v2(id % this._areaSize.width, Math.floor(id / this._areaSize.width));
    }

    public static get9GridCellIds(id:number):number[] {
        return [
            id + this._mapSize.width - 1, id + this._mapSize.width, id + this._mapSize.width + 1,
            id - 1, id, id + 1,
            id - this._mapSize.width - 1, id - this._mapSize.width, id - this._mapSize.width + 1
        ];
    }

    /**获取区域为中点的九宫格id列表*/
    public static get9GridAreaIds(id: number): number[] {
        return [
            id + this._areaSize.width - 1, id + this._areaSize.width, id + this._areaSize.width + 1,
            id - 1, id, id + 1,
            id - this._areaSize.width - 1, id - this._areaSize.width, id - this._areaSize.width + 1
        ];
    }

    public static get9GridVaildAreaIds(id: number): number[] {
        let list: number[] = [];
        let totalList: number[] = this.get9GridAreaIds(id);
        for (let i: number = 0; i < totalList.length; i++) {
            if (this.isVaildAreaId(totalList[i])) {
                list.push(totalList[i]);
            }
        }
        return list;
    }

    public static getAreaPointByCellPoint(x: number, y: number): cc.Vec2 {
        return cc.v2(Math.floor(x / this._areaCellSize.width), Math.floor(y / this._areaCellSize.height));
    }

    /**获取区域id*/
    public static getAreaIdByCellPoint(x: number, y: number): number {
        let point: cc.Vec2 = this.getAreaPointByCellPoint(x, y);
        return this.getIdByAreaPoint(point.x, point.y);
    }

    public static getStartCellPointByAreaPoint(x: number, y: number): cc.Vec2 {
        return cc.v2(x * this._areaCellSize.width, y * this._areaCellSize.height);
    }

    public static getEndCellPointByAreaPoint(x: number, y: number): cc.Vec2 {
        return cc.v2((x + 1) * this._areaCellSize.width, (y + 1) * this._areaCellSize.height);
    }

    public static getVaildAreaIdsByPixelPoints(...points: cc.Vec2[]): number[] {
        let list: number[] = [];
        for (let i: number = 0; i < points.length; i++) {
            let cellPoint: cc.Vec2 = this.mapPixelToCellPoint(points[i]);
            let areaPoint: cc.Vec2 = this.getAreaPointByCellPoint(cellPoint.x, cellPoint.y);
            let index: number = this.getIdByAreaPoint(areaPoint.x, areaPoint.y);
            if (this.isVaildAreaId(index)
                && list.indexOf(index) == -1) {
                list.push(index);
            }
        }
        return list;
    }

    //是否是有效的格子
    public static isVaildCellPoint(point: cc.Vec2): boolean {
        if (point.x >= 0 && point.x < this._mapSize.width
            && point.y >= 0 && point.y < this._mapSize.height) {
            return true;
        }
        return false;
    }

    //是否是有效的格子
    public static isVaildAreaPoint(point: cc.Vec2): boolean {
        if (point.x >= 0 && point.x < this._areaSize.width
            && point.y >= 0 && point.y < this._areaSize.height) {
            return true;
        }
        return false;
    }

    public static isVaildAreaId(id: number) {
        if (id >= 0 && id < this.areaCount) {
            return true;
        }
        return false;
    }

    // 世界像素坐标转地图坐标
    public static worldPixelToMapCellPoint(point: cc.Vec2): cc.Vec2 {
        //  转换原理 
        //  tiledMap 45度地图是已上方为(0,0)点 以左上方边界为y轴 右上方边界为x轴的坐标系
        //  所以只需要将点击坐标点的平行映射到地图坐标系的边界上 求解出映射点的像素坐标 / 格子大小 即可计算出对饮的 格子坐标
        let x: number = Math.floor(0.5 * this._mapSize.height + point.x / this._tileSize.width - point.y / this._tileSize.height);
        let y: number = Math.floor(1.5 * this._mapSize.width - point.x / this._tileSize.width - point.y / this._tileSize.height);
        return cc.v2(x, y);
    }

    //地图坐标(格子的中心点)转世界像素坐标
    public static mapCellToWorldPixelPoint(point: cc.Vec2): cc.Vec2 {
        let pixelX: number = this._zeroPixelPoint.x - (point.y - point.x) * this._tileSize.width * 0.5;
        let pixelY: number = this._zeroPixelPoint.y - (point.x + point.y) * this._tileSize.height * 0.5;
        return cc.v2(pixelX, pixelY);
    }

    // 地图坐标转地图像素坐标
    public static mapCellToPixelPoint(point: cc.Vec2): cc.Vec2 {
        let worldPoint: cc.Vec2 = this.mapCellToWorldPixelPoint(point);
        return worldPoint.sub(this._mapOffsetPoint);
    }

    //地图像素转地图坐标
    public static mapPixelToCellPoint(point: cc.Vec2): cc.Vec2 {
        let worldPoint: cc.Vec2 = point.add(this._mapOffsetPoint);
        return this.worldPixelToMapCellPoint(worldPoint);
    }
}