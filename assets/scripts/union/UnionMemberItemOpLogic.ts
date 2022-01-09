import { _decorator, Component, Button, Node } from 'cc';
const { ccclass, property } = _decorator;

import { MapCityData } from "../map/MapCityProxy";
import MapCommand from "../map/MapCommand";
import UnionCommand from "./UnionCommand";
import { Member, Union } from "./UnionProxy";

@ccclass('UnionMemberItemOpLogic')
export default class UnionMemberItemOpLogic extends Component {


    @property(Button)
    kickButton: Button = null;

    @property(Button)
    abdicateButton: Button = null;

    @property(Button)
    appointButton: Button = null;

    
    @property(Button)
    unAppointButton: Button = null;
    

    protected _menberData:Member = null;

    protected onLoad():void{
        this.node.on(Node.EventType.TOUCH_END, this.click, this);
    }

    protected onDestroy():void{
        this.node.off(Node.EventType.TOUCH_END, this.click, this);
    }

    protected click():void{
        this.node.active = false;
    }
    
    public setData(data):void{
        this._menberData = data;
        let city:MapCityData = MapCommand.getInstance().cityProxy.getMyMainCity();
        let unionData:Union = UnionCommand.getInstance().proxy.getUnion(city.unionId);
        if (unionData){
            if(this._menberData.rid == city.rid){
                this.node.active = false;
            }else{
                if(unionData.getChairman().rid == city.rid){
                    console.log("unionData:", unionData, unionData.getViceChairman(), this._menberData);

                    this.unAppointButton.node.active = unionData.getViceChairman().rid == this._menberData.rid;
                    this.kickButton.node.active = unionData.isMajor(city.rid);
                    this.abdicateButton.node.active = unionData.getChairman().rid == city.rid;
                    this.appointButton.node.active = unionData.getChairman().rid == city.rid && unionData.getViceChairman().rid != this._menberData.rid;
                }else if(unionData.getViceChairman().rid == city.rid){
                    if(unionData.getChairman().rid == this._menberData.rid){
                        this.node.active = false;
                    }else{
                        this.unAppointButton.node.active = false;
                        this.kickButton.node.active = true;
                        this.abdicateButton.node.active = unionData.getViceChairman().rid != this._menberData.rid;
                        this.appointButton.node.active = false;
                        this.node.active = true;
                    }
                }else{
                    this.node.active = false;
                }
            }
        }else{
            this.node.active = false;
        }
       
    }

    protected kick():void{
        UnionCommand.getInstance().unionKick(this._menberData.rid);
        this.node.active = false;
    }

    
    protected appoint():void{
        UnionCommand.getInstance().unionAppoint(this._menberData.rid, 1);
        this.node.active = false;
    }

    protected unAppoint():void{
        UnionCommand.getInstance().unionAppoint(this._menberData.rid, 2);
        this.node.active = false;
    }

    protected abdicate():void{
        UnionCommand.getInstance().unionAbdicate(this._menberData.rid);
        this.node.active = false;
    }
    

}
