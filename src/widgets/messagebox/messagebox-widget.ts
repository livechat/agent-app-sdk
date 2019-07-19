import { IConnection, createConnection } from '../connection';
import { IMessageBoxWidget, IRichMessage } from './interfaces';
import Widget from '../widget';
import withAmplitude from '../common/amplitude';
import withRichMessages from '../common/rich-messages';

function MessageBoxWidget(
  connection: IConnection<{}>
): IMessageBoxWidget {
  const widget = withRichMessages(withAmplitude(
    {
    ...Widget(connection),
    putMessage(msg: IRichMessage | string): Promise<void> {
      let data;
      if (typeof msg === 'string') {
        data = { type: 'text', value: msg };
      } else {
        data = { type: 'rich_message', payload: msg };
      }
      return connection.sendMessage('put_messagebox_message', data);
    }
  }));

  return widget;
}

export default function createMessageBoxWidget(): Promise<IMessageBoxWidget> {
  return createConnection().then(connection => MessageBoxWidget(connection));
}
