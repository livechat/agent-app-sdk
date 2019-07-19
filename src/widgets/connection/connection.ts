import mitt from '@livechat/mitt';
import * as drivers from './driver';
import { IConnectionDriver, IConnection, IInboxMessage } from './interfaces';
import { getQueryParam } from '../../utils/query-params';

const PLUGIN_ID_PARAM = 'plugin_id';
const CONNECTION_PARAM = 'connection';
const MESSAGE_PREFIX = 'livechat:';

function Connection<Events>(
  driver: IConnectionDriver,
  pluginId: string
): IConnection<Events> {
  const emitter = mitt<Events>();

  function handleMessage(message: IInboxMessage) {
    if (!message || !message.event_name) {
      return;
    }

    const messageName = message.event_name.toString();
    const messageData = message.event_data;

    if (messageName.startsWith(MESSAGE_PREFIX)) {
      emitter.emit(<any>messageName.replace(MESSAGE_PREFIX, ''), messageData);
    }
  }

  driver.listen(handleMessage);

  return {
    emitter,
    sendMessage(name: string, data: any = null): Promise<void> {
      return driver.send({
        plugin_id: pluginId,
        message: name,
        data
      });
    }
  };
}

export default function createConnection<Events>(): Promise<
  IConnection<Events>
> {
  const pluginId = getQueryParam(PLUGIN_ID_PARAM);
  const usePlainConnection = getQueryParam(CONNECTION_PARAM) === 'plain';
  const driverPromise = usePlainConnection
    ? Promise.resolve(drivers.Plain())
    : drivers.Trusted();
  return driverPromise.then(driver => Connection<Events>(driver, pluginId));
}
