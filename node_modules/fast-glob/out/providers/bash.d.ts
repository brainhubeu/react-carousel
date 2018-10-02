import * as readdir from 'readdir-enhanced';
import { IOptions } from '../fglob';
import { ITask } from '../utils/task';
export declare function async(task: ITask, options: IOptions): Promise<string[] | readdir.IEntry[]>;
export declare function sync(task: ITask, options: IOptions): (string | readdir.IEntry)[];
