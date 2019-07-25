import { Mitt } from '@livechat/mitt';

type ConnectionEvents = { [event: string]: any };

export type ConnectionEmitter<Events = ConnectionEvents> = Mitt<Events>;

export type ConnectionListener = (message: IInboxMessage) => void;

export interface IConnectionDriver {
  listen(listener: ConnectionListener): void;
  send(message: IOutboxMessage): Promise<void>;
}

export interface IConnection<Events = ConnectionEvents> {
  emitter: ConnectionEmitter<Events>;
  sendMessage: (name: string, data?: any) => Promise<void>;
}

export interface IInboxMessage {
  event_name: string;
  event_data?: any;
}

export interface IOutboxMessage {
  plugin_id: string;
  message: string;
  data?: any;
}
