var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __name = (target, value) => __defProp(target, "name", {value, configurable: true});
var __export = (target, all) => {
    for (var name2 in all)
        __defProp(target, name2, {
            get: all[name2],
            enumerable: true
        });
};
var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
        for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
            __defProp(to, key, {
            get: () => from[key],
            enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable
            });
    }
    return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
    // If the importer is in node compatibility mode or this is not an ESM
    // file that has been converted to a CommonJS file using a Babel-
    // compatible transform (i.e. "__esModule" has not been set), then set
    // "default" to the CommonJS "module.exports" for node compatibility.
    isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", {
        value: mod,
        enumerable: true
    }) : target,
    mod));
var __toCommonJS = (mod) => __copyProps(__defProp({},"__esModule" , { value:true}) , mod);

// index.ts
var src_exports = {};
__export(src_exports , {
    Config: () => Config,
    apply: () => apply,
    inject: () => inject,
    name: () => name,
    usage:() => usage
});
module.exports = __toCommonJS(src_exports);

// config.ts
var koishi = require("koishi");
var SConfig = koishi.Schema.intersect([
    koishi.Schema.object({dbAdmin: koishi.Schema.string().required().description("admin account")}).description("admin setting"),
    koishi.Schema.object({
            enabledServer: koishi.Schema.boolean(true).required().description("是否启用Server指令")}),
    koishi.Schema.object({
            initIP: koishi.Schema.string().required().description("初始地址") ,
            initPort: koishi.Schema.number().min(0).max(65535).default(25565).description("初始端口"),
            initTimeout: koishi.Schema.number().min(0).max(9999).default(600).description("超时:ms")
        }),
    koishi.Schema.object({enabledPlayerMessage:koishi.Schema.boolean().default(false).description("玩家进出通信")})
]);

// tools.ts
var net = __toESM(require("net"));
var dns = __toESM(require("dns"));
var dgram = __toESM(require("dgram"));
var import_buffer = require("buffer");
var import_util = require("util");

    // 握手
function createHandshakePacket(address, port, protocolVersion) {
    const packetId = 0;
    const state = 1;
    const protocolVersionBytes = writeVarInt(protocolVersion);
    const addressBytes = import_buffer.Buffer.from(address, "utf8");
    const addressLengthBytes = writeVarInt(addressBytes.length);
    const portBytes = import_buffer.Buffer.alloc(2);
    portBytes.writeUInt16BE(port, 0);
    const stateBytes = writeVarInt(state);
    const packetParts = [
    packetId,
    ...protocolVersionBytes,
    ...addressLengthBytes,
    ...addressBytes,
    ...portBytes,
    ...stateBytes
    ];
    const packetBuffer = import_buffer.Buffer.from(packetParts);
    const packetLength = writeVarInt(packetBuffer.length);
    const handshakePacket = import_buffer.Buffer.concat([packetLength, packetBuffer]);
    return handshakePacket;
}
__name(createHandshakePacket, "createHandshakePacket");

    // Request
function createRequestPacket() {
    const packetId = 0;
    const requestPacket = import_buffer.Buffer.from([packetId]);
    const packetLength = writeVarInt(requestPacket.length);
    const finalRequestPacket = import_buffer.Buffer.concat([packetLength, requestPacket]);
    return finalRequestPacket;
}
__name(createRequestPacket, "createRequestPacket");

    // writeVarInt
function writeVarInt(value) {
    const bytes = [];
    do {
    let temp = value & 127;
    value >>>= 7;
    if (value !== 0) {
        temp |= 128;
    }
    bytes.push(temp);
    } while (value !== 0);
    return import_buffer.Buffer.from(bytes);
    }
__name(writeVarInt, "writeVarInt");

    // ValidAddr: 返回地址
function getValidAddr(value, default_port) {
    const regex = /^(localhost|((?:[a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}|(?:\d{1,3}\.){3}\d{1,3}))(?::(\d+))?$/;
    const match = regex.exec(value);
    if (match) {
        const address = match[1];
        const port = parseInt(match[3] ?? `${default_port}`);
        return [address, port];
    }
    return [void 0, default_port];
}
__name(getValidAddr, "getValidAddr");

    // json
function flatJsonEntity(jsonObj) {
    const description = jsonObj;
    var result = [];
    if (description && description.extra) {
    for (const item of description.extra) {
        if (item.text) {
        var tmp = flatJsonString(item.text);
        if (tmp.length > 0) {
            tmp[0].color = item.color ? item.color : item.text.includes("§") ? getColorOrExecMap("json_color", `§${item.text[item.text.indexOf("§") + 1]}`) : "#ffffff";
            tmp[0].shadow = item.shadow ?? "#000000";
            tmp[0].randstr = item.randstr ?? false;
            tmp[0].bold = item.bold ?? false;
            tmp[0].strikethrough = item.strikethrough ?? false;
            tmp[0].underline = item.underline ?? false;
            tmp[0].italic = item.italic ?? false;
            tmp[0].reset = item.reset ?? false;
            result = result.concat(tmp);
        }
        } else if (typeof item == "string") {
        var curText2 = item.includes("§") ? item.slice(item.indexOf("§") + 2) : item;
        result.push({
            text: curText2,
            color: "#ffffff",
            shadow: "#000000",
            bold: false
        });
        }
        if (item.extra)
        result = result.concat(flatJsonEntity(item));
    }
    }
    return result;
}
__name(flatJsonEntity, "flatJsonEntity");
function flatJsonEntity2(jsonObj) {
    var result = [];
    if (jsonObj.text) {
    result = result.concat(flatJsonString(jsonObj.text));
    }
    return result;
}
__name(flatJsonEntity2, "flatJsonEntity2");
function flatJsonString(input_str) {
    var result = [];
    if (input_str.includes("§")) {
    var count = 0;
    var curColor = "#ffffff";
    var curShadow = "#000000";
    for (var i of input_str.split("\n")) {
        var item = i;
        if (count < input_str.split("\n").length && input_str.includes("\n"))
        item += "\n";
        var count2 = 0;
        for (var j of item.split("§")) {
        var temResult = {};
        if (j != "") {
            var fullText = "",
            param = "",
            content = "";
            if (count2 == 0)
            content = j;
            else {
            fullText = `§${j}`;
            param = `§${j}`.slice(0, 2);
            content = "";
            if (fullText.length > 2)
                content = fullText.slice(2);
            else
                content = "";
            try {
                var color_array = getColorOrExecMap("json_color", param);
                temResult.color = color_array[0];
                curColor = color_array[0] ?? curColor;
                temResult.shadow = color_array[1];
                curShadow = color_array[1] ?? curShadow;
            } catch {
                temResult[getColorOrExecMap("json_exec", param)] = true;
            }
            if (content != "") {
                temResult.text = content;
                temResult.color = temResult.color ?? curColor;
                temResult.shadow = temResult.shadow ?? curShadow;
                temResult.randstr = temResult.randstr ?? false;
                temResult.bold = temResult.bold ?? false;
                temResult.strikethrough = temResult.strikethrough ?? false;
                temResult.underline = temResult.underline ?? false;
                temResult.italic = temResult.italic ?? false;
                temResult.reset = temResult.reset ?? false;
                if (content.trim().length === 0 && temResult.strikethrough)
                temResult.text = "-".repeat(content.length);
                result.push(temResult);
                temResult = {};
            }
            }
        }
        count2++;
        }
        count++;
    }
    } else {
    result.push({
        text: input_str,
        color: "#ffffff",
        shadow: "#000000",
        randstr: false,
        bold: false,
        strikethrough: false,
        underline: false,
        italic: false,
        reset: false
    });
    }
    return result;
}
__name(flatJsonString, "flatJsonString");

    // filterDescText: json
function filterDescText(description) {
    var result = "Minecraft服务器";
    var textList = [];
    if (typeof description == "string") {
    var textJson = {
        "text": `${description}`,
        "color": "#ffffff"
    };
    textList = flatJsonEntity2(textJson);
    } else if (description.text && description.extra == void 0) {
    textList = flatJsonEntity2(description);
    } else
    textList = flatJsonEntity(description);
    if (textList.length > 0)
    result = "";
    for (var item of textList)
    result += item.text;
    return result;
}
__name(filterDescText, "filterDescText");

    // JeLatency : 测算延迟
async function getJeLatency(addr, port) {
    return new Promise((resolve, reject) => {
    dns.lookup(addr, (err, address) => {
        if (err) {
        reject(err);
        return;
        }
        const startTime = Date.now();
        const client = net.createConnection({
        host: address,
        port
        }, () => {
        client.write(import_buffer.Buffer.from([254, 1]));
        });
        client.on("data", () => {
        const endTime = Date.now();
        const latency = endTime - startTime;
        client.end();
        resolve(latency);
        });
        client.on("error", (error) => {
        resolve(Number.MAX_VALUE);
        });
        client.on("close", () => {
        const endTime = Date.now();
        const latency = endTime - startTime;
        resolve(latency);
        });
    });
    });
}
__name(getJeLatency, "getJeLatency");

    // SRV记录
function getSrvInfo(host) {
return new Promise((resolve, reject) => {
    dns.resolveSrv(`_minecraft._tcp.${host}`, (err, addresses) => {
    if (err) {
        console.error("Error in SRV:", err);
        resolve([void 0, void 0]);
    }
    if (addresses == void 0 || addresses.length === 0) {
        resolve([void 0, void 0]);
    } else {
        var addr = "",
        port = 0;
        addresses.forEach((srvRecord) => {
        addr = srvRecord.name;
        port = srvRecord.port;
        });
        resolve([addr, port]);
    }
    });
});
}
__name(getSrvInfo, "getSrvInfo");

    // ServerJson
async function getJeServJson(addr, port, timeout = 1500) {
    var result = void 0;
    return new Promise((resolve, reject) => {
    const client = new net.Socket();
    let dataBuffer = import_buffer.Buffer.alloc(0);
    let startTime = Date.now();
    client.setTimeout(timeout);
    client.setNoDelay(true);
    client.connect({
        host: addr,
        port
    }, () => {
        console.log("Connected to Server");
        const handshakePacket = createHandshakePacket(addr, port, 766);
        client.write(handshakePacket);
        const requestPacket = createRequestPacket();
        client.write(requestPacket);
    });
    client.on("data", (chunk) => {
        console.log(`Receive a DataBuffer，Length：${chunk.length}`);
        dataBuffer = import_buffer.Buffer.concat([dataBuffer, chunk]);
        if (Date.now() - startTime > timeout) {
        console.log("Receive Time Out!");
        client.destroy();
        }
    });
    client.on("close", () => {
        console.log("Connection Close...");
        var rawStr = dataBuffer.toString();
        var newStr = rawStr.slice(rawStr.indexOf('{"'));
        try {
        result = JSON.parse(newStr);
        } catch {
        console.log("Error when parsing json string");
        }
        resolve(result);
    });
    client.on("error", (err) => {
        console.error("Error in getJeServJson:", err);
        resolve(result);
    });
    client.on("timeout", () => {
        console.log("Time Out!");
        client.destroy();
    });
    });
}
__name(getJeServJson, "getJeServJson");

async function ServerState(mcClient , isShowVersion = true , isShowList = false){
    var result = void 0;
    const addrLatency = '地址: ${mcClient.queryString}  |  Ping : ${mcClient.isSuccess == true ? mcClient.latency : "∞"}ms';

    // 绘制
}
__name(ServerState , "ServerState");


// database.ts
var DB_MOTDLIST_NAME = "mcmessager.motdlist";

function databaseContext(ctx , config){
    ctx.model.extend(DB_MOTDLIST_NAME , {
        id: "unsigned",
        date: "timestamp",
        guild_id: "string",
        user_id: "string",
        serv_type: "string",
        serv_addr: "string"
    }, {
        primary: "id",
        autoInc: true
    });
}
__name(databaseContext , "databaseContext");


// model.ts
var McClient = class {
    static {
    __name(this, "McClient");
    }
    addr;
    port;
    latency = -9999;
    version;
    protocol;
    favicon;
    description;
    onlinePlayers = 0;
    maxPlayers = 0;
    isSuccess = false;
    isApplySuccess = false;
    hidePort = false;
    queryString;
    font;
    canvas;
    ctx;
    // Koishi Context
};

var McClientJE = class extends McClient {
    static {
    __name(this, "McClientJE");
    }
    constructor(addr, port = 25565) {
    super();
    this.addr = addr;
    this.port = port;
    // this.favicon = getInitFavicon("java", icon_type == "新版图标" ? "new" : "origin");
    this.queryString = port != 25565 ? `${this.addr}:${this.port}` : `${this.addr}`;
    }
    chatReport = false;
    isSrvServer = false;
    isInitHead = true;
    tryVerify = false;
    isGenuine = void 0;
    playerList;
    headApiList;
    enableCape = false;
    capeApiList;
    jsonResp;
    capePosition;
    toString() { return JSON.stringify(this);}
    async tryToSrvInfo(ctx) {
        var resList = await getSrvInfo(this.addr);
        if (resList[0] == void 0 || resList[1] == void 0)
            return false;
        else {
            this.addr = resList[0];
            this.port = resList[1];
            this.isSrvServer = true;
            return true;
        }
    }
    async requestInfo(ctx , time_out = 1500) {
        this.ctx = ctx;
        var result = await getJeServJson(this.addr, this.port, time_out);
        if (result != void 0) {
            this.jsonResp = result;
            this.isSuccess = true;
            return this.isSuccess;
        } else {
            return false;
        }
    }
    async applyInfo() {
    try {
        this.latency = parseInt(`${await getJeLatency(this.addr, this.port) / 2}`);
        this.version = this.jsonResp.version.name;
        this.protocol = this.jsonResp.version.protocol;
        if (this.jsonResp.favicon != void 0)
        this.favicon = this.jsonResp.favicon;
        this.description = this.jsonResp.description;
        this.onlinePlayers = this.jsonResp.players.online;
        this.maxPlayers = this.jsonResp.players.max;
        this.chatReport = !this.jsonResp.preventsChatReports;
        this.playerList = this.jsonResp.players.sample;
        this.isApplySuccess = true;
        return this.isApplySuccess;
    } catch (err) {
        return false;
    }
    }
    async printInfo(isShowVersion = true, isShowList = true) {
    var playerListString = "\n";
    var judgeGenuineServer = "";
    if (isShowList && this.playerList != void 0)
        this.playerList.forEach((player) => {
        playerListString += `[${player.name}]` + '\n';
        });
    if (this.tryVerify) {
        await this.isGenuineServer();
        judgeGenuineServer = `正版: ${this.isGenuine == void 0 ? "未知" : this.isGenuine}` + '\n';
    }
    return `地址: ${this.addr}:${this.port}
MOTD：${filterDescText(this.description)}
${isShowVersion ? `版本: ${this.version}
` : ""}延迟: ${this.latency}ms
在线人数: ${this.onlinePlayers} / ${this.maxPlayers}
${isShowList ? `玩家: ${playerListString != "\n" ? playerListString : "暂时无人"}` : ""}
`;
    }
    async generatePic(isShowVersion = true, isShowList = true) {
    if (this.tryVerify)
        await this.isGenuineServer();
    return await MotdStatePic(this, isShowVersion, isShowList);
    }
    async SwitchPic(isShowVersion = true) {
    if (this.tryVerify)
        await this.isGenuineServer();
    return await MotdswitchPic(this, isShowVersion);
    }
    async PlayerChangePic(newPlayers, leftPlayers, isShowVersion = true) {
    if (this.tryVerify)
        await this.isGenuineServer();
    return await MotdPlayerChangePic(this, newPlayers, leftPlayers, isShowVersion);
    }
    async PlayerListPic(PlayerList,ListName,isShowVersion = true) {
    if (this.tryVerify)
        await this.isGenuineServer();
    return await MotdPlayerListPic(this,PlayerList,ListName, isShowVersion);
    }
    async isGenuineServer() {
    if (this.playerList && this.playerList.length >= 1) {
        for (var player of this.playerList) {
        if (!player.name)
            continue;
        if (player.name && (player.name == "" || player.name.length == 0 || player.name.replace(/\s/g, "") == "" || player.name.includes("§")))
            continue;
        if (player.name == "Anonymous Player")
            continue;
        var true_obj = await getUuidNameByName(this.ctx, player.name);
        if (true_obj == void 0)
            continue;
        var true_name = true_obj["name"];
        var true_uuid = true_obj["id"];
        if (player.id.replace(/-/g, "") == true_uuid && player.name == true_name)
            this.isGenuine = true;
        else
            this.isGenuine = false;
        return this.isGenuine;
        }
    }
    }
    };

// motd.ts
var import_koishi2 = require("koishi");

function ServerContext(ctx , config){
    const MOTD_SW = config.enabledServer ?? false;
    const INIT_DOMAIN = config.initIP;
    const INIT_PORT = config.initPort ?? 25565;

    if(MOTD_SW){
        ctx.command("server <ip:string> [port:number]" , "查询服务器信息" , {authority : 1})
        .alias("server").option("<ip>" , "查询服务器地址").option("<port>" , "端口")
        .example("server localhost").example("server localhost:25565").action(async({session} , ...args) => {
            var curAddr = INIT_DOMAIN ;
            var curPort = INIT_PORT;
            if (curAddr == void 0) return "无指定地址";
            if (args[1] != void 0) {
                curAddr = args[0] ;
                curPort = args[1] ;
                if ('/^(?!.*:\/\/)([^\s\/]+:\d+)$/'.test(curAddr)) return '地址非法';
            }
            else if (args[0] != void 0){
                const curAddrList = getValidAddr(args[0] , 25565);
                curAddr = curAddrList[0] ?? INIT_DOMAIN;
                curPort = curAddrList[1] ?? INIT_PORT;
            }
            return await GetMotd(ctx , config , curAddr , curPort);
        });
    }
}
__name(ServerContext , "ServerContext");

async function GetMotd(ctx , config , address , port ){
    const INIT_TOUT = config.initTimeout ?? 750;
    const SHOW_PLAEYERLIST = config.isShowList ?? true;
    const isShowVersion = config.isShowVersion ?? true;

    var mc = new McClientJE(address , port);
    mc.ctx = ctx;
    if(await mc.requestInfo(mc.ctx , INIT_TOUT)){
        if(await mc.applyInfo()){
            return mc.printInfo(isShowVersion , SHOW_PLAEYERLIST);
        }
    }
    else if (await mc.tryToSrvInfo(mc.ctx)){
        if(await mc.requestInfo(mc.ctx , INIT_TOUT)){
            if(await mc.applyInfo()){
                return mc.printInfo(isShowVersion , SHOW_PLAEYERLIST);
            }
        }
    }
    else return '获取服务器 ${mc.queryString}信息失败';
}
__name(GetMotd , "GetMotd");

function formatTime(seconds) {
    const days = Math.floor(seconds / (24 * 3600));
    seconds %= 24 * 3600;
    const hours = Math.floor(seconds / 3600);
    seconds %= 3600;
    const minutes = Math.floor(seconds / 60);
    seconds %= 60;

    let result = '';
    if (days > 0) result += `${days}d`;
    if (hours > 0) result += `${hours}h`;
    if (minutes > 0) result += `${minutes}m`;
    if (seconds > 0 || result === '') result += `${seconds}s`;

    return result;
}
__name(formatTime, "formatTime");


// index.ts
const name = "mcmessager";
var Config = SConfig;
const inject = {required : ['database']};
const usage = '## test usage Any problem Contact mckidsteve plz';
function apply(ctx , config){
    databaseContext(ctx , config);
    ServerContext(ctx , config);
    ctx.logger.info("Mcmessager loaded!");
}
__name(apply, "apply");

0 & (module.exports = {
    Config,
    name ,
    apply,
    inject,
    usage,
});

