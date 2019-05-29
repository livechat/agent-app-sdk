import { connectToParent } from '@livechat/postmessage/es5';
import {
  IConnectionDriver,
  ConnectionListener,
  IInboxMessage,
  IOutboxMessage
} from './interfaces';

const ORIGIN_LIST = {
  'http://my.lc:3000': true,
  'https://my.labs.livechatinc.com': true,
  'https://my.staging.livechatinc.com': true,
  'https://my.livechatinc.com': true
};

export function Plain(): IConnectionDriver {
  let currentListener: ConnectionListener = (_: IInboxMessage) => {};

  function handleEvent(event) {
    if (ORIGIN_LIST[event.origin] === true) {
      currentListener(event.data);
    }
  }

  window.addEventListener('message', handleEvent);

  return {
    listen(listener: ConnectionListener) {
      currentListener = listener;
    },
    send(message: IOutboxMessage) {
      parent.postMessage(message, '*');
      return Promise.resolve();
    }
  };
}

interface ITrustedChild {
  call: (method: string, ...args: any[]) => Promise<void>;
}

export function Trusted(): Promise<IConnectionDriver> {
  let currentListener: ConnectionListener = (_: IInboxMessage) => {};

  function handleMessage(message: IInboxMessage) {
    currentListener(message);
  }

  return connectToParent({ handle: handleMessage }).promise.then(
    (child: ITrustedChild) => ({
      listen(listener: ConnectionListener) {
        currentListener = listener;
      },
      send(message: IOutboxMessage) {
        return child.call('handle', message).then(() => {});
      }
    })
  );
}
