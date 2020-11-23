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
}