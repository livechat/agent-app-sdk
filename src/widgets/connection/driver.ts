import { connectToParent } from '@livechat/postmessage/es5';
import {
  IConnectionDriver,
  ConnectionListener,
  IInboxMessage,
  IOutboxMessage
} from './interfaces';
import { getIsEventOriginAllowed } from './helpers';

export function Plain(): IConnectionDriver {
  let currentListener: ConnectionListener = (_: IInboxMessage) => {};

  function handleEvent(event) {
    const isEventOrignAllowed = getIsEventOriginAllowed(event.origin);

    if (isEventOrignAllowed) {
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
