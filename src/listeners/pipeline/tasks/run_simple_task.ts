import { EventListenerCallback, SendCallback } from "../../../broker/event_handler";
import { WorkerPool } from "../../../services/worker/worker_pool";

export default async (data: any, send: SendCallback) => {
  const workerPool = new WorkerPool(3);
  workerPool.runTask(data , (err, data) => {
    if(err){
      console.error(err);
    }else{
      send(data)
    };
  })
}
