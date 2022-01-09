
class EventHandler {
    public handler!:Function;
    public target!:object;

    constructor(handler:Function, target:object){
        this.handler = handler;
        this.target = target;
    }
}

class mgr {
    private static _instance: mgr = null;
    private events:Map<string, EventHandler[]> = new Map();
    private targetInName:Map<object, Set<string>> = new Map();

    public static instance(): mgr {
        if (this._instance == null) {
            this._instance = new mgr();
        }
        return this._instance;
    }

    public on(name:string, handler:Function, target:object){
        if(!this.events.has(name)){
            this.events.set(name, []);
        }

        var events = this.events.get(name);
        for (let i = 0; i < events.length; i++) {
            const eh:EventHandler = events[i];
            if(eh.handler == handler && eh.target == target){
                //已经添加过了
                console.log("已经添加过了:", name, handler, target);
                return;
            }
        }

        var eh:EventHandler = new EventHandler(handler, target);
        events.push(eh);

        if(!this.targetInName.has(target)){
            this.targetInName.set(target, new Set())
        }
        var set = this.targetInName.get(target);
        set.add(name);
    }

    public off(name:string, handler:Function, target:object){
        if(!this.events.has(name)){
            return;
        }

        var events = this.events.get(name);
        for (let i = 0; i < events.length; i++) {
            const eh:EventHandler = events[i];
            if(eh.handler == handler && eh.target == target){
                events.splice(i, i+1);
                break;
            }
        }
    }

    public emit(name:string, ...args:any){
        if(!this.events.has(name)){
            return;
        }

        var events = this.events.get(name);
        for (let i = 0; i < events.length; i++) {
            const eh:EventHandler = events[i];
            eh.handler.apply(eh.target, args);
        }
    }

    public targetOff(target:object){

        if(!this.targetInName.has(target)){
            return;
        }

        var targetInName = this.targetInName.get(target);

        targetInName.forEach(name => {
            if(this.events.has(name)){
               let events = this.events.get(name);
               for (let i = 0; i < events.length; i++) {
                   const eh = events[i];
                   if(eh.target == target){
                        events.splice(i, i+1);
                        i = i-1;
                   }
               }
            }
        });
        
        targetInName.clear();
    }
}

var EventMgr = mgr.instance();
export { EventMgr };
