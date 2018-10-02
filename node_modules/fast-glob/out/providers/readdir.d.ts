import * as readdir from 'readdir-enhanced';
import { ITask } from '../utils/task';
import { IOptions } from '../fglob';
export declare function async(task: ITask, options: IOptions): Promise<string[] | readdir.IEntry[]>;
export declare function sync(task: ITask, options: IOptions): (string | readdir.IEntry)[];
