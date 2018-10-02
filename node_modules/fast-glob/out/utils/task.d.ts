import { IOptions } from '../fglob';
export interface ITask {
    base: string;
    patterns: string[];
}
export declare function generateTasks(patterns: string[], options: IOptions): ITask[];
