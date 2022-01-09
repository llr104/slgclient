import { _decorator, Component, Prefab, Layout, instantiate, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

import GeneralItemLogic, { GeneralItemType } from "./GeneralItemLogic";
import { EventMgr } from '../../utils/EventMgr';

@ccclass('DrawRLogic')
export default class DrawRLogic extends Component {


    @property(Prefab)
    generalItemPrefab: Prefab = null;

    @property(Layout)
    tenLayout:Layout = null;

    @property(Layout)
    oneLayout:Layout = null;

    private _maxSize:number = 10;
    private _scale:number = 0.4;

    protected onLoad():void{

        for(var i = 0; i < this._maxSize;i++){
            let _generalNode = instantiate(this.generalItemPrefab);
            _generalNode.parent = this.tenLayout.node;
            _generalNode.scale = new Vec3(this._scale, this._scale, this._scale);
            _generalNode.active = false;
        }


        let _generalNode = instantiate(this.generalItemPrefab);
        _generalNode.parent = this.oneLayout.node;
        _generalNode.scale = new Vec3(this._scale, this._scale, this._scale);
        _generalNode.active = false;

    }



    public setData(data:any):void{
        this.tenLayout.node.active = this.oneLayout.node.active = false;
        if(data.length == 1){
            this.oneLayout.node.active = true;
            var children = this.oneLayout.node.children;
            let com = children[0].getComponent(GeneralItemLogic);
            children[0].active = true;
            if(com){
                com.setData(data[0],GeneralItemType.GeneralNoThing);
            }

        }else{
            this.tenLayout.node.active = true;
            var children = this.tenLayout.node.children;
            for(var i = 0; i < this._maxSize;i++){
                var child = children[i];
                if(data[i]){
                    child.active = true;
                    let com = child.getComponent(GeneralItemLogic);
                    if(com){
                        com.setData(data[i],GeneralItemType.GeneralNoThing);
                    }
                }
                else{
                    child.active = false;
                }
            }
        }

    }


    protected onClickClose(): void {
        this.node.active = false;
    }





}
