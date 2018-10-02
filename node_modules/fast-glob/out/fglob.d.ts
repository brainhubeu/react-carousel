import { IEntry } from 'readdir-enhanced';
export interface IOptions {
    deep?: number | boolean;
    cwd?: string;
    stats?: boolean;
    ignore?: string | string[];
    onlyFiles?: boolean;
    onlyDirs?: boolean;
    bashNative?: string[];
    transform?: (entry: string | IEntry) => any;
}
export default function async(source: string | string[], options?: IOptions): Promise<(string | IEntry)[]>;
export declare function sync(source: string | string[], options?: IOptions): (string | IEntry)[];
