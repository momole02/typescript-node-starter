
import { EventEmitter } from "events";
import { Task, TaskDoneCallback, TaskParameters, WWorker, WorkerPoolTaskInfo, kTaskInfo, kWorkerFreedEvent, } from "./types";

/**
 * Le code qui suit s'inspire de l'implémentation d'un pool de threads (Workers)
 * expliquée dans la documentation de node JS : 
 * https://nodejs.org/api/async_context.html#using-asyncresource-for-a-worker-thread-pool 
 */

/**
 * Classe permettant de gérer un pool de threads (Workers)
 */
class WorkerPool extends EventEmitter
{
  private numThreads: number;
  private workers: any[]; 
  private freeWorkers: any[];
  private tasks: Task[];

  /**
   * Constructeur
   */
  constructor(numThreads: number) {
    super(); 
    this.numThreads = numThreads;
    this.workers = [];
    this.freeWorkers = [];
    this.tasks = [];

    for(let i=0; i < numThreads; ++i) {
      this.addNewWorker();
    }


    this.on(kWorkerFreedEvent , () => {
      // Dès qu'une tâche fini on en lance une autre
      if(this.tasks.length > 0 ) {
        const {task, callback} = this.tasks.shift()!;
        this.runTask(task, callback);
      }
    })
  }

  /**
   * Ajoute un nouveau Worker dans le pool
   */
  private addNewWorker() {

    const ww = new WWorker("worker_tasks/task_processor.js");
    ww.worker.on("message" , (result) => {
      // A la fin on appelle le callback avec le resultat
      ww[kTaskInfo]!.done(null, result);
      ww[kTaskInfo] = null;
      this.freeWorkers.push(ww);
      this.emit(kWorkerFreedEvent);
    })
    ww.worker.on("error", (err) => {
      // En cas d'erreur on appelle le callback avec l'erreur
      // Et on libere le thread du pool 
      if(ww[kTaskInfo] != null){
        ww[kTaskInfo].done(err, null);
      }else{
        this.emit("error", err);
      }
    })
    this.workers.push(ww);
    this.freeWorkers.push(ww);
    this.emit(kWorkerFreedEvent);
  }
  /**
   * Démarre une nouvelle tâche
   * 
   * @param {TaskParameters} task
   * @param {TaskDoneCallback} callback 
   * 
   */
  runTask(task: TaskParameters, callback: TaskDoneCallback) {
    if(this.freeWorkers.length == 0) {
      // Aucun thread libre
      this.tasks.push({task, callback})
      return ; 
    }
    const ww = this.freeWorkers.pop();
    ww[kTaskInfo] = new WorkerPoolTaskInfo(callback);
    ww.worker.postMessage(task);
  }
}