import { Schema } from 'koishi';

export interface IMotd {
    id: number;
    date: number;
    guild_id: string;
    user_id: string;
    serv_type: string;
    serv_addr: string;
}
export interface IWlist {
    id: number;
    date: number;
    guild_id: string;
    user_id: string;
}
export interface ISPList {
    id: number;
    date: number;
    Rid: string;
    Rplatform: string;
    guild_id: string;
    serv_type: string;
    serv_addr: string;
    record_online_time: boolean;
}
export interface TTList {
    id: number;
    date: number;
    guild_id: string;
    serv_type: string;
    serv_addr: string;
    Name: string;
    UUID: string;
    Online_Time: number;
}
export interface BTList {
    id: number;
    date: number;
    guild_id: string;
    serv_type: string;
    serv_addr: string;
    Name: string;
    UUID: string;
    Online_Time: number;
}

export interface IConfig{
    dbAdmin: string;
    enableServer: boolean;
    initIP: number;
    initPort: number;
    initTimeout: number;
    enablePlayerMessage: boolean;
}

export declare const SConfig : Schema<IConfig>;