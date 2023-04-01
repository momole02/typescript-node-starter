/**
 * Exception associé à un évenement
 */
class EventHandlerError extends Error
{
  constructor(message:string){
    super(message);
    this.name = "EventHandlerError";
  }
}