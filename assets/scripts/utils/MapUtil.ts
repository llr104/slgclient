/**地图相关算法*/
export default class MapUtil {
    public static tiledMap: cc.TiledMap;
    //格子大小
    protected static tileSize: cc.Size = cc.size(256, 128);;
    //地图大小 宽高需要相同
    protected static mapSize: cc.Size = cc.size(20, 20);
    //地图 (0, 0)点对应的像素坐标
    protected static zeroPixelPoint: cc.Vec2 = cc.v2(0, 0);

    // 初始化地图配置
    public static initMapConfig(map: cc.TiledMap): void {
        this.tiledMap = map;
        this.tileSize = map.getTileSize();
        this.mapSize = map.getMapSize();
        this.zeroPixelPoint.x = this.mapSize.width * this.tileSize.width * 0.5;
        this.zeroPixelPoint.y = this.mapSize.height * this.tileSize.height - this.tileSize.height * 0.5;
        console.log("initMapConfig", this.tileSize, this.mapSize, this.zeroPixelPoint);
    }

    // 世界像素坐标转地图坐标
    public static worldPixelToMapCellPoint(point: cc.Vec2): cc.Vec2 {
        //  转换原理 
        //  tiledMap 45度地图是已上方为(0,0)点 以左上方边界为y轴 右上方边界为x轴的坐标系
        //  所以只需要将点击坐标点的平行映射到地图坐标系的边界上 求解出映射点的像素坐标 / 格子大小 即可计算出对饮的 格子坐标
        let row: number = Math.floor(1.5 * this.mapSize.width - point.x / this.tileSize.width - point.y / this.tileSize.height);
        let col: number = Math.floor(0.5 * this.mapSize.height + point.x / this.tileSize.width - point.y / this.tileSize.height);
        return cc.v2(col, row);
    }

    //地图坐标(格子的中心点)转世界像素坐标
    public static mapCellToWorldPixelPoint(point: cc.Vec2): cc.Vec2 {
        let pixelX: number = this.zeroPixelPoint.x - (point.y - point.x) * this.tileSize.width * 0.5;
        let pixelY: number = this.zeroPixelPoint.y - (point.x + point.y) * this.tileSize.height * 0.5;
        return cc.v2(pixelX, pixelY);
    }

    // 地图坐标转地图像素坐标
    public static mapCellToPixelPoint(point: cc.Vec2): cc.Vec2 {
        let worldPoint: cc.Vec2 = this.mapCellToWorldPixelPoint(point);
        let node:cc.Node = this.tiledMap.node;
        return worldPoint.sub(cc.v2(node.width * node.anchorX, node.height * node.anchorY));
    }

    //地图像素转地图坐标
    public static mapPixelToCellPoint(point: cc.Vec2): cc.Vec2 {
        let node:cc.Node = this.tiledMap.node;
        let worldPoint: cc.Vec2 = point.add(cc.v2(node.width * node.anchorX, node.height * node.anchorY));
        return this.worldPixelToMapCellPoint(worldPoint);
    }
}