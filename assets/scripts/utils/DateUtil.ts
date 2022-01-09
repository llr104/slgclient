
export default class DateUtil {
    protected static _serverTime: number = 0;
    protected static _getServerTime: number = 0;

    public static setServerTime(time: number): void {
        this._serverTime = time;
        this._getServerTime = Date.now();
    }

    public static getServerTime(): number {
        let nowTime: number = Date.now();
        return nowTime - this._getServerTime + this._serverTime;
    }

    //是否在该时间之后
    public static isAfterServerTime(stms:number):boolean{
        var st = this.getServerTime();
        return st - stms > 0;
    }

    public static leftTime(stms:number):number{
        var st = this.getServerTime();
        return stms - st;
    }

    public static leftTimeStr(stms:number):string{
        var diff = this.leftTime(stms);
        return this.converSecondStr(diff);
    }

    /**补零*/
    public static fillZero(str: string, num: number = 2): string {
        while (str.length < num) {
            str = "0" + str;
        }
        return str;
    }

    /**时间字符串格式转换
     * 年 YYYY
     * 月 MM
     * 日 DD
     * 时 hh
     * 分 mm
     * 秒 ss
     * 毫秒 zzz*/
    public static converTimeStr(ms: number, format: string = "hh:mm:ss"): string {
        let date: Date = new Date(ms);
        let year: string = this.fillZero(date.getFullYear() + "", 4);
        let month: string = this.fillZero((date.getMonth() + 1) + "", 2);
        let dat: string = this.fillZero(date.getDate() + "", 2);
        let hour: string = this.fillZero(date.getHours() + "", 2);
        let minute: string = this.fillZero(date.getMinutes() + "", 2);
        let second: string = this.fillZero(date.getSeconds() + "", 2);
        let minSecond: string = this.fillZero(date.getMilliseconds() + "", 3);

        let str: string = format + "";
        str = format.replace(/YYYY/, year);
        str = str.replace(/MM/, month);
        str = str.replace(/DD/, dat);
        str = str.replace(/hh/, hour);
        str = str.replace(/mm/, minute);
        str = str.replace(/ss/, second);
        str = str.replace(/zzz/, minSecond);
        return str;
    }

    /**简易时间字符串格式转换*/
    public static converSecondStr(ms: number, format: string = "hh:mm:ss"): string {
        let second: number = Math.floor(ms / 1000);
        let hour: number = Math.floor(second / 3600);
        // console.log("hour:", hour);

        second -= hour * 3600;
        let minute:number = Math.floor(second / 60);
        second -= minute * 60;
        
        let str: string = format + "";
        if (hour > 0) {
            str = str.replace(/hh/, this.fillZero(hour + "", 2));
        } else {
            str = str.replace(/hh:/, "");
        }
        str = str.replace(/mm/, this.fillZero(minute + "", 2));
        str = str.replace(/ss/, this.fillZero(second + "", 2));
        return str;
    }
}
