import { SendCallback } from "../../../broker/event_handler";
import { CommonRequest } from "../../../broker/message_broker";
import { glo } from "../../../services/logger/logger";
import { VMTask, VMTaskStatus } from "../../../services/worker/types";
import { ErrorCodes } from "../../error";

/**
 * Exécute une tâche préalablement enregistrée
 * 
 * request data = {
 *  taskId: <Identifiant de la tâche>
 * }
 */
export default async (request: CommonRequest, send: SendCallback) => {
  const onError = (error: any) => {
    glo.console.error(`Failed when running task taskId=${request.data.taskId}, requestId=${request.id}`)
    glo.console.error(error);
    send({
      success: false,
      errorCode: ErrorCodes.internalError,
      requestId: request.id,
    })
  }
  try {
    const { taskId } = request.data;
    const pool = global.vmTasksPools[taskId]; 
    if(pool != null) {
      const index = global.vmTasks.findIndex((t) => t.id == taskId);
      const task = global.vmTasks[index];
      task.status = VMTaskStatus.running; // marqué la tache comme démarée
      pool.runTask(task, (err, context) => {
        delete global.vmTasksPools[task.id]; // supprimer le pool associé
        const index = global.vmTasks.findIndex((t) => t.id == task.id);
        global.vmTasks[index].status = VMTaskStatus.terminated; // marker la tache comme terminée
        if(err){
         onError(err);
        }else{
          send({
            success: true,
            requestId: request.id,
            data : { context } 
          })
        }
      })
    }
  } catch (error) {
    onError(error);
  }
}