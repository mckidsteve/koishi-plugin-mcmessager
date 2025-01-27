import { Context, Schema } from 'koishi';
import { IConfig } from './config';
export declare const name = "mcmessager";
export declare const Config = Schema<IConfig>;
export declare const inject: {
    required: string[];
};
export declare const usage = "Koishiapp by mckidsteve";
export declare function apply(ctx: Context , config : IConfig): void;
