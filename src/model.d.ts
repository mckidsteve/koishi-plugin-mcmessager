export declare class McClient {
    addr: string;
    port: number;
    latency?: number;
    version?: string;
    protocol?: number;
    favicon?: any;
    description?: any;
    onlinePlayers: number;
    maxPlayers: number;
    isSuccess: boolean;
    hidePort: boolean;
    queryString: string;
    font: string;
    canvas: any;
    ctx: any;
}
export declare class McClientJE extends McClient {
    constructor(icon_type: string, addr: string, port?: number);
    chatReport: boolean;
    isSrvServer: boolean;
    isInitHead: boolean;
    tryVerify: boolean;
    isGenuine: boolean;
    playerList?: any[];
    headApiList?: any[];
    enableCape: boolean;
    capeApiList?: any[];
    jsonResp?: any;
    capePosition: string;
    toString(): string;
    tryToSrvInfo(): Promise<boolean>;
    requestInfo(time_out?: number): Promise<boolean>;
    applyInfo(): Promise<boolean>;
    printInfo(isShowVersion?: boolean, isShowList?: boolean): Promise<string>;
    generatePic(isShowVersion?: boolean, isShowList?: boolean): Promise<string>;
    isGenuineServer(): Promise<boolean>;
}