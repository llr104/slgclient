import { _decorator, Component, ScrollView, Prefab, Node, NodePool, EventHandler, UITransform, instantiate, CCBoolean, CCString, Vec3 } from 'cc';
const {ccclass, property} = _decorator;

@ccclass('ListLogic')
export default class ListLogic extends Component {

    @property(ScrollView)
    scrollView: ScrollView = null;

    @property(Prefab)
    itemPrefab: Prefab = null;


    @property(Node)
    itemNode: Node = null;

    @property(CCString)
    itemLogicScriptName:string  = "";


    @property(CCBoolean)
    isHorizontal:boolean  = false;


    @property
    columnCount = 1;


    @property(CCBoolean)
    autoColumnCount:boolean  = false;


    @property
    spaceColumn = 1;

    @property
    spaceRow = 1;


    @property
    updateInterval = 0.1;

    @property
    scale = 1;

    @property([EventHandler])
    itemClickEvents:EventHandler[]  = [];


    
    @property(CCBoolean)
    isVirtual:boolean  = false;

    private _curOffset:number = 0;
    private _maxOffset:number = 0;
    private _startIndex:number = 0;
    private _itemCount:number = 0;
    private _updateTimer:number = 0;
    private _curIndex:number = 0;
    private _newOffset:number = 0;
    private _initContentPos:number = 0;
    private _maxRowColSize:number = 0;
    private _itemWidth:number = 0;
    private _itemHeight:number = 0;
    private _isUpdateList:boolean = false;
    private _itemPool:NodePool = null;
    private _items:any = [];
    private _datas:any = null;

    protected onLoad():void{
        this._updateTimer = 0;//上次更新间隔时间
        this._curIndex = -1;
        this._newOffset = 0;
        this._initContentPos = 0;
        this._maxRowColSize = 0;//当前一行或者一列可以显示的最大宽度或者高度
        this._itemWidth = this._itemHeight = 0;
        if (this.itemPrefab) {
            
            this._itemWidth = this.itemPrefab.data.getComponent(UITransform).width * this.scale;//item宽度
            this._itemHeight = this.itemPrefab.data.getComponent(UITransform).height * this.scale;//item高度
        } else if (this.itemNode) {
            this.itemNode.active = false;
            this._itemWidth = this.itemNode.getComponent(UITransform).width * this.scale;//item宽度
            this._itemHeight = this.itemNode.getComponent(UITransform).height * this.scale;//item高度
        }

        if (this.isHorizontal) {
            this.scrollView.content.getComponent(UITransform).anchorX = 0;
        } else {
            this.scrollView.content.getComponent(UITransform).anchorY = 1;
        }

        this._isUpdateList = false;//是否正在更新列表
        this._itemPool = new NodePool();//item缓存对象池
        this._items = [];//item列表
        this.updateList();
    }





    protected onDestroy():void {
        this._itemPool.clear();
        this._items.length = 0;
        this._datas = null;
    }


    protected update (dt):void {
        this._updateTimer += dt;
        if (this._updateTimer < this.updateInterval) {
            return;//更新间隔太短
        }
        this._updateTimer = 0;
        // if (this.isVirtual == false) {
        //     return;//非虚拟列表 不需要刷新位置和数据
        // }
        if (this._isUpdateList) {
            return;//正在重新构建列表的时候 是不刷新的
        }
        let curOffset = 0;
       
        if (this.isHorizontal) {
            curOffset = this._initContentPos - this.scrollView.content.position.x;
        } else {
            curOffset = this.scrollView.content.position.y - this._initContentPos;
        }
        curOffset = Math.max(Math.min(curOffset, this._maxOffset), 0);
        this.setCurOffset(curOffset);
       
    }




    protected setCurOffset(curOffset):void {
    
        if (this._datas == null || this._datas.length == 0) {
            return;//没有数据不执行刷新
        }
        if (this._items == null || this._items.length == 0) {
            return;//没有显示对象也不执行刷新
        }
        if (this._curOffset != curOffset) {
            // console.log("setCurOffset", this._curOffset, curOffset);
            this._curOffset = curOffset;
            if (this.isVirtual) {
                if (this.isHorizontal) {
                    var startIndex = Math.floor(this._curOffset / (this._itemWidth + this.spaceColumn)) * this.columnCount;
                    this.setStartIndex(startIndex);
                } else {
                    var startIndex = Math.floor(this._curOffset / (this._itemHeight + this.spaceRow)) * this.columnCount;
                    this.setStartIndex(startIndex);
                }
            } else {
                this.setStartIndex(0);//非虚拟列表startIndex不变
            }
            //console.log("updatelist11 y", this.scrollView.content.y);
        }
    }

    


    protected setStartIndex(index) {
        if (this._startIndex != index && this._items.length > 0) {
            //console.log("setStartIndex", this._startIndex, index);
            this._startIndex = index;
            let suit = this.scrollView.content.getComponent(UITransform);
            for (var i = 0; i < this._items.length; i++) {
                var item:Node = this._items[i];
                var index1 = this._startIndex + i;
                let iuit = item.getComponent(UITransform);
                let pos = item.position.clone();

                if (this.isHorizontal) {
                    let _row = i % this.columnCount;
                    let _toY = _row * (this._itemHeight + this.spaceRow) + iuit.anchorY * this._itemHeight - suit.height * suit.anchorY;
                    pos.y = -_toY - (suit.height - this._maxRowColSize) / 2;
                    pos.x = Math.floor(index1 / this.columnCount) * (this._itemWidth + this.spaceColumn) + this.spaceColumn + (1 - iuit.anchorX) * this._itemWidth;
                } else {
                    let _col = i % this.columnCount;
                    let _toX = _col * (this._itemWidth + this.spaceColumn) + iuit.anchorX * this._itemWidth - suit.width * suit.anchorX;
                    pos.x = _toX + (suit.width - this._maxRowColSize) / 2;
                    pos.y = -Math.floor(index1 / this.columnCount) * (this._itemHeight + this.spaceRow) - this.spaceRow - (1 - iuit.anchorY) * this._itemHeight;
                }
                item.itemIdx = index1;
                item.setPosition(pos);
                //console.log("update item position x: " + item.x + ", y: " + item.y);
            }

            this.updateItems();
        }
    }


    
        /**设置item实例数量*/
    protected  updateItemCount(count):boolean {
            if (this._itemCount != count) {
                this._itemCount = count;
                //清空列表
                var children = this.scrollView.content.children.slice();
                this.scrollView.content.removeAllChildren();
                for (var i = 0; i < children.length; i++) {
                    let item = children[i];
                    if (item.isValid) {
                        item.off(Node.EventType.TOUCH_END, this.onItemClick, this);
                        this._itemPool.put(item);//加入对象池
                    }
                }
                this._items.length = 0;
                for (var i = 0; i < this._itemCount; i++) {
                    let item = this.createItem();
                    item.active = false;
                    item.itemIdx = i;//在item上纪录当前下标
                    item.on(Node.EventType.TOUCH_END, this.onItemClick, this);
                    this.scrollView.content.addChild(item);
                    this._items.push(item);
                }
                return true;
            }
            return false;
    }




        /**
     * 更新列表
     */
    protected updateList():void {
        if (this._datas == null || this._items == null || this._itemPool == null) {
            return;
        }
        //计算布局
        if (this._itemWidth <= 0 || this._itemHeight <= 0) {
            console.log("the list item has no width or height");
            return;
        }
        if (this._datas.length <= 0) {
            this._curOffset = this._startIndex = -1;//重置纪录
            this.hideItems();
            return;
        }
        this._isUpdateList = true;
        this.scrollView.stopAutoScroll();//更新时 停止滚动
        var rowCount = 1;
        var showCount = 1;
        var dataLen = this._datas.length;
        let uit = this.scrollView.content.parent.getComponent(UITransform);
        let cuit = this.scrollView.content.getComponent(UITransform);
        if (this.isHorizontal) {
            if (this.autoColumnCount) {
                //自动排列
                this.columnCount = Math.floor(uit.height / this._itemHeight);
            }
            if (this.columnCount < 1) {
                this.columnCount = 1;
            }
            this._maxRowColSize = this.columnCount * (this._itemHeight + this.spaceRow) - this.spaceRow;
            rowCount = Math.ceil(uit.width / (this._itemWidth + this.spaceColumn)) + 1;
            if (this.isVirtual) {
                showCount = rowCount * this.columnCount;
            } else {
                showCount = dataLen;
            }
            cuit.width = Math.ceil(dataLen / this.columnCount) * (this._itemWidth + this.spaceColumn);
            this._maxOffset = this.scrollView.getMaxScrollOffset().x;
            this._initContentPos = uit.width * (0 - uit.anchorX);
        } else {
            if (this.autoColumnCount) {
                //自动排列
                this.columnCount = Math.floor(uit.width / this._itemWidth);
            }
            if (this.columnCount < 1) {
                this.columnCount = 1;
            }
            this._maxRowColSize = this.columnCount * (this._itemWidth + this.spaceColumn) - this.spaceColumn;
            rowCount = Math.ceil(uit.height / (this._itemHeight + this.spaceRow)) + 1;
            if (this.isVirtual) {
                showCount = rowCount * this.columnCount;
            } else {
                showCount = dataLen;
            }
            cuit.height = Math.ceil(dataLen / this.columnCount) * (this._itemHeight + this.spaceRow);
            this._maxOffset = this.scrollView.getMaxScrollOffset().y;
            this._initContentPos = uit.height * (1 - uit.anchorY);
        }

        var isItemChange = this.updateItemCount(showCount);
        this._newOffset = Math.max(Math.min(this._newOffset, this._maxOffset), 0);
       

        if ((isItemChange || this._newOffset != this._curOffset)) {
            let pos = this.scrollView.content.position.clone();
            this._curOffset = this._newOffset;
            if (this.isHorizontal) {
                pos.x = -Math.abs(this._initContentPos - this._newOffset);
            } else {
                pos.y = Math.abs(this._initContentPos + this._newOffset);
            }
            this._curOffset = -1;//重置纪录
            this._startIndex = -1;//重置纪录
            this.setCurOffset(this._newOffset);
            this.scrollView.content.setPosition(pos);
        } else {
            this.updateItems();
        }
        this._isUpdateList = false;
        //console.log("updatelist y", this.scrollView.content.y);

        console.log("this.scrollView:", this.scrollView);
    }


    


        //刷新所有item数据
    protected updateItems():void {
        
        for (var i = 0; i < this._items.length; i++) {
            var item = this._items[i];
            console.log("updateItems:", item, item.itemIdx, this._datas.length, item.itemIdx < this._datas.length)
            item.active = item.itemIdx < this._datas.length;
            if (item.active) {
                this.updateItem(item, item.itemIdx);
                this.selectItem(item, item.itemIdx == this._curIndex);
            }
                //console.log("update item i: " + item.itemIdx + ", active: " + item.active);
        }
    }


    protected hideItems():void {
        for (var i = 0; i < this._items.length; i++) {
            this._items[i].active = false;
        }
    }


    protected updateItem(item, index):void {
        var comp = null;
        if (this.itemLogicScriptName) {
            comp = item.getComponent(this.itemLogicScriptName);
            if (comp && comp.updateItem) {
                comp.updateItem(this._datas[index], index);
            }
        }
    }


    /**
     * 根据下标获取item对象
     */
    protected getItem(index):any{
        var item = null;
        if (this._items) {
            for (var i = 0; i < this._items.length; i++) {
                if (this._items[i].itemIdx == index) {
                    item = this._items[i];
                    break;
                }
            }
        }
        return item;
    }


    /**
     * 选中item
     */
    protected selectItem(item, isSelected):void {
        var comp = null;
        if (this.itemLogicScriptName) {
            comp = item.getComponent(this.itemLogicScriptName);
            if (comp && comp.isSelected) {
                comp.isSelected(isSelected);
            }
        }
    }

    /**
     * 创建item
     */
    protected createItem():any {
        var item = null;
        if (this._itemPool.size() > 0) { // 通过 size 接口判断对象池中是否有空闲的对象
            item = this._itemPool.get();
        } else if (this.itemPrefab) { // 如果没有空闲对象，也就是对象池中备用对象不够时，我们就用 instantiate 重新创建
            item = instantiate(this.itemPrefab);
            
        } else if (this.itemNode) { // 如果没有空闲对象，也就是对象池中备用对象不够时，我们就用 instantiate 重新创建
            item = instantiate(this.itemNode);
            
        }
        item.scale = new Vec3(this.scale, this.scale, this.scale);
        item.acitve = true;
        item.on(Node.EventType.TOUCH_END, this.onItemClick, this);
        return item;
    }

    protected setIndex(index):void {
        if (this._curIndex != index) {
            if (this._curIndex >= 0 && this._curIndex < this._datas.length) {
                var oldItem = this.getItem(this._curIndex);
                if (oldItem) {
                    this.selectItem(oldItem, false);
                }
            }
            var newItem = this.getItem(index);
            if (newItem) {
                this.selectItem(newItem, true);
            }
            this._curIndex = index;
        }
    }

    /**
     * item点击回调
     */
    protected onItemClick(event):void {
        var index = event.target.itemIdx;
        this.setIndex(index);
        this.itemClickEvents.forEach(function (handler) {
            handler.emit([this._datas[index], index, event.target]);
        }.bind(this));
    }

    /**
     * 设置列表数据
     * scrollOffset 没有传值代表刷新到初始位置 其他整数代表刷新到当前位置的相对偏移量
     */
    public setData(data, scrollOffset?:any):void{
        this._datas = data;
        if (scrollOffset != null && scrollOffset != undefined && !isNaN(scrollOffset)) {
            this._newOffset = this._curOffset + scrollOffset;
        } else {
            this._newOffset = 0;
        }
        // console.log("list logiv setData", data, scrollOffset, this._newOffset);
        this.updateList();
    }

    protected scrollToIndex(index):void {
        if (this._datas == null || this._items == null || this._itemPool == null) {
            return;
        }
        if (this._isUpdateList) {
            return;//正在重新构建列表的时候 是不刷新的
        }
        if (index < 0 || index >= this._datas.length) {
            return;//数据不合法
        }
        var curOffset = 0;
        if (this.isHorizontal) {
            curOffset = Math.ceil(index / this.columnCount) * (this._itemWidth + this.spaceColumn);
        } else {
            curOffset = Math.ceil(index / this.columnCount) * (this._itemHeight + this.spaceRow);
        }
        curOffset = Math.max(Math.min(curOffset, this._maxOffset), 0);
        this.setCurOffset(curOffset);
    }
}
