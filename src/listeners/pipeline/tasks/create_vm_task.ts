import { EventListenerCallback, SendCallback } from "../../../broker/event_handler";
import { CommonRequest } from "../../../broker/message_broker";
import { glo } from "../../../services/logger/logger";
import { VMTask, VMTaskStatus } from "../../../services/worker/types";
import { WorkerPool } from "../../../services/worker/worker_pool";
import { ErrorCodes } from "../../error";

const MAX_TASKS = 1000 

/**
 * Génère un identifiant pour les tâches
 */
const generateTaskId = (): string => {
  let found = null;
  let genId:string = "";
  do{
    const rand = Math.floor((Math.random() * (MAX_TASKS - 100)) + 100);
    genId = `#${rand}`;
    found = global.vmTasks.find((task:VMTask) => task.id == genId);
  }while(found != null);
  return genId;
}

/**
 * Appelée lors de la requête de création d'une tâche
 * 
 * request data = {
 *  id : <ID utilisateur de la tache>
 *  context: <Contexte d'exécution de la VM>
 *  code: <Code d'execution de la VM>
 * }
 * 
 * reponse data = {
 *  taskId: <ID de la tache>
 * }
 * 
 * @param {CommonRequest} request
 * @param {SendCallback} send 
 */
export default async (request: CommonRequest, send: SendCallback) => {
  try{
    if(global.vmTasks.length == MAX_TASKS) {
      // Nombre max de taches atteint
      send({
        success: false, 
        requestId: request.id, 
        errorCode: ErrorCodes.maxVMTasksReached,
      })
      return ; 
    }
    const pool = new WorkerPool(1);
    const taskId = generateTaskId(); 
    const task: VMTask = {
      id: taskId, 
      runtime: {
        context : request.data.context,
        code: request.data.code,
      },
      status: VMTaskStatus.waiting,
    }
    global.vmTasks.push(task);
    global.vmTasksPools[taskId] = pool;
    send({
      success: true,
      requestId: request.id,
      data: {
        taskId,
      } 
    })
    glo.console.log(`Created VM Task ${taskId} for request ${request.id}`);
  }catch(error) {
    glo.console.error(`Failed when creating task for request ${request.id}`);
    glo.console.error(error)
    send({
      success: false,
      requestId: request.id,
      errorCode : ErrorCodes.internalError,
    })
  }
}
