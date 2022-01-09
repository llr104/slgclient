import { ISocket } from "./NetInterface";
import * as crypto  from "../../libs/crypto/crypto"
import * as gzip from "../../libs/gzip/gzip";
import { convert } from "../../libs/convert";



export class WebSock implements ISocket {
    private _ws: WebSocket = null;              // websocket对象
    private _key:String = "";


    onConnected(event):void{
        console.log("websocket onConnected:",event);
    }


    onJsonMessage(data:any){

    }


    onGetKey(){

    }


    onMessage(msg):void{
    
        // console.log("websocket onMessage0:",msg)
        var ab = msg
        var view = new Uint8Array(ab)
        var undata = gzip.unzip(view)
        var c = new convert()
        msg = c.byteToString(undata)
        // console.log("websocket onMessage1:",msg)

        //第一次
        if(this._key == ""){
            try {
                var hand_data = JSON.parse(msg);
                console.log("hand_data:",hand_data)
                if(hand_data.name == "handshake"){
                    this._key = hand_data.msg.key;
                    this.onGetKey();                    
                    return;
                }
            } catch (error) {
                console.log("handshake parse error:",error)
            }
        }

        // console.log("websocket onMessage2:",msg)

        var decrypted = null;
        try {
            decrypted = this.getAnddecrypt(msg);
        } catch (error) {
            console.log("message ecrypt error:",error)
        }

        if(decrypted == ""){
            this._key = "";
        }
        // console.log("onMessage decrypted :",decrypted);
        if(decrypted){
            var json = JSON.parse(decrypted);
            this.onJsonMessage(json);
        }


    }

    onError(event):void{
        console.log("websocket onError:",event)
    }

    onClosed(event):void{
        console.log("websocket onClosed:",event)
    }

    connect(options: any) {
        if (this._ws) {
            if (this._ws.readyState === WebSocket.CONNECTING) {
                console.log("websocket connecting, wait for a moment...")
                return false;
            }
        }

        let url = null;
        if(options.url) {
            url = options.url;
        } else {
            let ip = options.ip;
            let port = options.port;
            let protocol = options.protocol;
            url = `${protocol}://${ip}:${port}`;    
        }
        console.log()
        this._ws = new WebSocket(url);
        this._ws.binaryType = options.binaryType ? options.binaryType : "arraybuffer";
        this._ws.onmessage = (event) => {
            this.onMessage(event.data);
        };

        this._ws.onopen = this.onConnected;
        this._ws.onerror = this.onError;
        this._ws.onclose = this.onClosed;

        return true;
    }

    send(buffer: any) {
        if (this._ws.readyState == WebSocket.OPEN)
        {
            this._ws.send(buffer);
            return true;
        }
        return false;
    }

    close(code?: number, reason?: string) {
        this._key = "";
        this._ws.close(code, reason);
    }


    /**
     * json 加密打包
     * @param send_data 
     */
    public packAndSend(send_data:any){
        //console.log("WebSocke packAndSend:",send_data)
        var encrypt = this._key == ""?send_data:this.encrypt(send_data);
        //console.log("encrypt:",encrypt);

        var data = gzip.zip(encrypt, {level:9});
        var c = new convert()
        var undata = gzip.unzip(data)
        //var msg = c.byteToString(undata)
        //console.log("unzip:", msg);
        
        var buffer = new ArrayBuffer(data.length);
		var i8arr = new Int8Array(buffer);
		for(var i = 0; i < i8arr.length; i++){
			i8arr[i]= data[i];
        }

        // console.log("i8arr:",i8arr)
        this.send(i8arr)


    }

    /**
     * 解密
     * @param msg 
     */
    public getAnddecrypt(get_msg:any){
        var decrypt = this._key == ""?get_msg:this.decrypt(get_msg);
        // console.log("decrypt:",decrypt);
        return decrypt
    }


     encrypt(data:any) {
        var key = crypto.enc.Utf8.parse(this._key);
        var iv  = crypto.enc.Utf8.parse(this._key);

        if(typeof(data)=='object'){
            data = JSON.stringify(data);
        }
        let srcs = crypto.enc.Utf8.parse(data);
        let encrypted = crypto.AES.encrypt(srcs, key, { iv: iv, mode: crypto.mode.CBC, padding: crypto.pad.ZeroPadding });
    
    
        return encrypted.ciphertext.toString()
    }


    decrypt(message:string) {
        var key = crypto.enc.Utf8.parse(this._key);
        var iv  = crypto.enc.Utf8.parse(this._key);

        let encryptedHexStr = crypto.enc.Hex.parse(message);
        let srcs = crypto.Base64.stringify(encryptedHexStr);
        let decrypt = crypto.AES.decrypt(srcs, key, { iv: iv, mode: crypto.mode.CBC, padding: crypto.pad.ZeroPadding });
        // console.log("decrypt:", decrypt);

        let decryptedStr = decrypt.toString(crypto.enc.Utf8);
        // console.log("decryptedStr 1111:", typeof(decryptedStr), decryptedStr, decryptedStr.length);
        var str = decryptedStr.replaceAll("\u0000", "")

        // console.log("decryptedStr 2222:", typeof(str), str, str.length);
        return str;
    }

}
