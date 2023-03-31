import { glo } from "../services/logger/logger";
import { GlobalEventHandler } from "./event_handler";
import { MessageBroker } from "./message_broker";

const handler = GlobalEventHandler.instance;
const broker = MessageBroker.instance;

export {handler, broker}

