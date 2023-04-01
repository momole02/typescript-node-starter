
import path from "node:path";
import { Worker } from "worker_threads";
import { AsyncResource } from "async_hooks";
export interface TaskParameters {
  a: number;
  b: number;
}

export interface Task {
  task: TaskParameters; 
  callback: TaskDoneCallback;
}

export const kTaskInfo = Symbol("kTaskInfo");
export const kWorkerFreedEvent = Symbol("kWorkerFreedEvent");

export type TaskDoneCallback = (err: any, result: any) => void;

/**
 * Contient les données associées un worker
 * (ex: le callback de fin)
 */
export class WorkerPoolTaskInfo extends AsyncResource
{  
  /**
   *  Le constructeur
   * 
   * @param {TaskDoneCallback} callback 
   */
  constructor(private callback: TaskDoneCallback) {
    super("WorkerPoolTaskInfo");
  }

  /**
   * Méthode appelée lorsque la tâche est terminée
   * 
   * @param {any} err 
   * @param {any} result 
   */
  done(err: any, result: any) {
    this.runInAsyncScope(this.callback, null, err, result);
    this.emitDestroy();
  }
}

/**
 * Wrapper pour le type Worker afin de pouvoir supporter le symbol
 * [kTaskInfo]
 */
export class WWorker {
  public worker: Worker;
  public taskInfo: WorkerPoolTaskInfo | null;

  constructor(resource: string | URL) {
    this.worker = new Worker(resource);
    this.taskInfo = null ; 
  }
  
  get [kTaskInfo]() : WorkerPoolTaskInfo | null {
    return this.taskInfo;
  }

  set [kTaskInfo](info: WorkerPoolTaskInfo | null) {
    this.taskInfo = info;
  }
}