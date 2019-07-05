import { IConnection, ConnectionEmitter } from '../connection';
import { Omit } from '../../utils/types';

export type AnyWidgetApi = { [key: string]: any };

export type AnyWidgetEvents = { [event: string]: any };

export type WidgetBase<Events extends AnyWidgetEvents = AnyWidgetEvents> = Pick<
  ConnectionEmitter<Events>,
  'on' | 'off'
> & {
  sendMessage(name: string, data?: any): Promise<void>;
};

export type Widget<
  Api extends AnyWidgetApi = AnyWidgetApi,
  Events extends AnyWidgetEvents = AnyWidgetEvents
> = WidgetBase<Events> & Omit<Api, keyof WidgetBase>;

export type WidgetMixin<Api, Events> = {
  <BaseApi extends AnyWidgetApi, BaseEvents extends AnyWidgetEvents>(
    widget: Widget<BaseApi, BaseEvents>
  ): Widget<BaseApi & Api, BaseEvents & Events>;
};

export function createWidget<
  Api extends AnyWidgetApi,
  Events extends AnyWidgetEvents = {}
>(connection: IConnection<Events>, api: Api): Widget<Api, Events> {
  return {
    ...api,
    on: connection.emitter.on,
    off: connection.emitter.off,
    sendMessage(name: string, data: any = null): Promise<void> {
      return connection.sendMessage(name, data);
    }
  };
}
