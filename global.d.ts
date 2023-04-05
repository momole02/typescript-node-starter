import { VMTaskInfo } from "./src/services/worker/types";
import { WorkerPool } from "./src/services/worker/worker_pool";

declare global {
  var vmTasks: VMTaskInfo[] /** Liste des tâches de la VM */
  var vmTasksPools: {[key: string]:WorkerPool} /** Pools associés aux ID des tâches */
}

export {}

