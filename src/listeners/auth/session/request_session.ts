
import { EventListenerCallback, SendCallback } from "../../../broker/event_handler";
import { glo } from "../../../services/logger/logger";

export default async (data: any, send: SendCallback) => {
  glo.console.debug("Data" , data);
  send({
    "fake_sess_id" : 1234
  })
}