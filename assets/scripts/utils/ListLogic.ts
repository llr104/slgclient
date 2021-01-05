// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import ResCellLogic from "../map/entries/ResCellLogic";

const {ccclass, property} = cc._decorator;

@ccclass
export default class ListLogic extends cc.Component {

    @property(cc.ScrollView)
    scrollView: cc.ScrollView = null;

    @property(cc.Prefab)
    itemPrefab: cc.Prefab = null;


    @property(cc.Node)
    itemNode: cc.Node = null;

    @property(cc.String)
    itemLogicScriptName:string  = "";


    @property(cc.Boolean)
    isHorizontal:boolean  = false;


    @property
    columnCount = 1;


    @property(cc.Boolean)
    autoColumnCount:boolean  = false;


    @property
    spaceColumn = 1;

    @property
    spaceRow = 1;


    @property
    updateInterval = 0.1;

    @property
    scale = 1;

    @property([cc.Component.EventHandler])
    itemClickEvents:cc.Component.EventHandler[]  = [];


    
    @property(cc.Boolean)
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
    private _itemPool:cc.NodePool = null;
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
            this._itemWidth = this.itemPrefab.data.width * this.scale;//item宽度
            this._itemHeight = this.itemPrefab.data.height * this.scale;//item高度
        } else if (this.itemNode) {
            this.itemNode.active = false;
            this._itemWidth = this.itemNode.width * this.scale;//item宽度
            this._itemHeight = this.itemNode.height * this.scale;//item高度
        }

        this._isUpdateList = false;//是否正在更新列表
        this._itemPool = new cc.NodePool();//item缓存对象池
        this._items = [];//item列表
        this.updateList();


        console.log("this._itemHeight:", this._itemHeight);
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
            curOffset = this._initContentPos - this.scrollView.content.x;
        } else {
            curOffset = this.scrollView.content.y - this._initContentPos;
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
            for (var i = 0; i < this._items.length; i++) {
                var item = this._items[i];
                var index1 = this._startIndex + i;
                if (this.isHorizontal) {
                    let _row = i % this.columnCount;
                    let _toY = _row * (this._itemHeight + this.spaceRow) + item.anchorY * this._itemHeight
                        - this.scrollView.content.height * this.scrollView.content.anchorY;
                    item.y = -_toY - (this.scrollView.content.height - this._maxRowColSize) / 2;
                    item.x = Math.floor(index1 / this.columnCount) * (this._itemWidth + this.spaceColumn)
                        + this.spaceColumn + (1 - item.anchorX) * this._itemWidth;
                } else {
                    let _col = i % this.columnCount;
                    let _toX = _col * (this._itemWidth + this.spaceColumn) + item.anchorX * this._itemWidth
                        - this.scrollView.content.width * this.scrollView.content.anchorX;
                    item.x = _toX + (this.scrollView.content.width - this._maxRowColSize) / 2;
                    item.y = -Math.floor(index1 / this.columnCount) * (this._itemHeight + this.spaceRow)
                        - this.spaceRow - (1 - item.anchorY) * this._itemHeight;
                }
                item.itemIdx = index1;
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
                this.scrollView.content.removeAllChildren(false);
                for (var i = 0; i < children.length; i++) {
                    var item = children[i];
                    if (cc.isValid(item)) {
                        item.off(cc.Node.EventType.TOUCH_END, this.onItemClick, this);
                        this._itemPool.put(item);//加入对象池
                    }
                }
                this._items.length = 0;
                for (var i = 0; i < this._itemCount; i++) {
                    var item = this.createItem();
                    item.active = false;
                    item.itemIdx = i;//在item上纪录当前下标
                    item.on(cc.Node.EventType.TOUCH_END, this.onItemClick, this);
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
        if (this.isHorizontal) {
            if (this.autoColumnCount) {
                //自动排列
                this.columnCount = Math.floor(this.scrollView.content.parent.height / this._itemHeight);
            }
            if (this.columnCount < 1) {
                this.columnCount = 1;
            }
            this._maxRowColSize = this.columnCount * (this._itemHeight + this.spaceRow) - this.spaceRow;
            rowCount = Math.ceil(this.scrollView.content.parent.width / (this._itemWidth + this.spaceColumn)) + 1;
            if (this.isVirtual) {
                showCount = rowCount * this.columnCount;
            } else {
                showCount = dataLen;
            }
            this.scrollView.content.width = Math.ceil(dataLen / this.columnCount) * (this._itemWidth + this.spaceColumn);
            this._maxOffset = this.scrollView.getMaxScrollOffset().x;
            this._initContentPos = this.scrollView.content.parent.width * (0 - this.scrollView.content.parent.anchorX);
        } else {
            if (this.autoColumnCount) {
                //自动排列
                this.columnCount = Math.floor(this.scrollView.content.parent.width / this._itemWidth);
            }
            if (this.columnCount < 1) {
                this.columnCount = 1;
            }
            this._maxRowColSize = this.columnCount * (this._itemWidth + this.spaceColumn) - this.spaceColumn;
            rowCount = Math.ceil(this.scrollView.content.parent.height / (this._itemHeight + this.spaceRow)) + 1;
            if (this.isVirtual) {
                showCount = rowCount * this.columnCount;
            } else {
                showCount = dataLen;
            }
            this.scrollView.content.height = Math.ceil(dataLen / this.columnCount) * (this._itemHeight + this.spaceRow);
            this._maxOffset = this.scrollView.getMaxScrollOffset().y;
            this._initContentPos = this.scrollView.content.parent.height * (1 - this.scrollView.content.parent.anchorY);
        }

        var isItemChange = this.updateItemCount(showCount);
        this._newOffset = Math.max(Math.min(this._newOffset, this._maxOffset), 0);
        if ((isItemChange || this._newOffset != this._curOffset)) {
            this._curOffset = this._newOffset;
            if (this.isHorizontal) {
                this.scrollView.content.x = -Math.abs(this._initContentPos - this._newOffset);
            } else {
                this.scrollView.content.y = Math.abs(this._initContentPos + this._newOffset);
            }
            this._curOffset = -1;//重置纪录
            this._startIndex = -1;//重置纪录
            this.setCurOffset(this._newOffset);
        } else {
            this.updateItems();
        }
        this._isUpdateList = false;
        //console.log("updatelist y", this.scrollView.content.y);
    }



        //刷新所有item数据
    protected updateItems():void {
        try {
            for (var i = 0; i < this._items.length; i++) {
                var item = this._items[i];
                item.active = item.itemIdx < this._datas.length;
                if (item.active) {
                    this.updateItem(item, item.itemIdx);
                    this.selectItem(item, item.itemIdx == this._curIndex);
                }
                    //console.log("update item i: " + item.itemIdx + ", active: " + item.active);
            }
        } catch (e) {
            console.log("List update item error:", e);
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
        } else if (this.itemPrefab) { // 如果没有空闲对象，也就是对象池中备用对象不够时，我们就用 cc.instantiate 重新创建
            item = cc.instantiate(this.itemPrefab);
            item.scale = this.scale;
        } else if (this.itemNode) { // 如果没有空闲对象，也就是对象池中备用对象不够时，我们就用 cc.instantiate 重新创建
            item = cc.instantiate(this.itemNode);
            item.acitve = true;
            item.scale = this.scale;
        }
        item.on(cc.Node.EventType.TOUCH_END, this.onItemClick, this);
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
    protected setData(data, scrollOffset):void{
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
