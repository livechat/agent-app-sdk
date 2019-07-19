import { IConnection, ConnectionEmitter } from './connection';

export interface IWidget {
  on: ConnectionEmitter['on'];
  off: ConnectionEmitter['off'];
  sendMessage(name: string, data?: any): Promise<void>;
}

export default function Widget(connection: IConnection): IWidget {
  return {
    on: connection.emitter.on,
    off: connection.emitter.off,
    sendMessage(name: string, data: any = null): Promise<void> {
      return connection.sendMessage(name, data);
    }
  };
}
