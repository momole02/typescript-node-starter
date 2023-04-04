/**
 * Exception associé à un évenement
 */
export class EventHandlerError extends Error
{
  constructor(message:string){
    super(message);
    this.name = "EventHandlerError";
  }
}