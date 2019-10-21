import { createWidget } from '../shared/widget';
import { withAmplitude } from '../shared/amplitude';
import { withCustomerProfile } from '../shared/customer-profile';
import { withRichMessages } from '../shared/rich-messages';
import { IConnection, createConnection } from '../connection';
import {
  IMessageBoxWidgetApi,
  IMessageBoxWidgetEvents,
  IRichMessage
} from './interfaces';

function MessageBoxWidget(connection: IConnection<IMessageBoxWidgetEvents>) {
  const base = createWidget<IMessageBoxWidgetApi, IMessageBoxWidgetEvents>(
    connection,
    {
      putMessage(msg: IRichMessage | string): Promise<void> {
        let data;
        if (typeof msg === 'string') {
          data = { type: 'text', value: msg };
        } else {
          data = { type: 'rich_message', payload: msg };
        }
        return connection.sendMessage('put_messagebox_message', data);
      }
    }
  );

  const widget = withAmplitude(withRichMessages(withCustomerProfile(base)));

  return widget;
}

export interface IMessageBoxWidget
  extends ReturnType<typeof MessageBoxWidget> {}

export default function createMessageBoxWidget(): Promise<IMessageBoxWidget> {
  return createConnection<IMessageBoxWidgetEvents>().then(connection =>
    MessageBoxWidget(connection)
  );
}
