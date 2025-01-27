import { Context } from "koishi";
import { IConfig, IMotd, IWlist , ISPList , TTList , BTList } from "./config";
declare module 'koishi' {
    interface Tables {
        'mcmessager.motdlist': IMotd;
    }
}
export declare const DB_MOTDLIST_NAME = "mcmessager.motdlist";
export declare function databaseContext(ctx: Context, config: IConfig): void;
