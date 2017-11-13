import {Message} from "./message.model";

export class Error extends Message {

  constructor(title?: string, text?: string){
    super("error", title, text);
    this.title = title ? title : 'Oops!';
    this.text = text ? text : 'Something went wrong';
  }

}
