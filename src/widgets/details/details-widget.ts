import withRichMessages from '../common/rich-messages';
import withAmplitude from '../common/amplitude';
import { IConnection, createConnection } from '../connection';
import assertSection from './custom-sections';
import {
  IDetailsWidget,
  IDetailWidgetEvents,
  ICustomerProfile,
  ISection
} from './interfaces';
import { pipe } from '../../utils/pipe';
import Widget from '../widget';

function DetailsWidget(
  connection: IConnection<IDetailWidgetEvents>
): IDetailsWidget {
  let customerProfile = null;
  let customerProfileHidden = null;

  function onCustomerProfile(profile) {
    customerProfile = profile;
  }

  function onCustomerProfileHidden(profile) {
    customerProfileHidden = profile;
  }

  connection.emitter.on('customer_profile', onCustomerProfile);
  connection.emitter.on('customer_profile_hidden', onCustomerProfileHidden);

  const initialized = connection.sendMessage('plugin_inited');

  function sendMessage(name: string, data: any = null): Promise<void> {
    return initialized.then(() => {
      connection.sendMessage(name, data);
    });
  }

  const base = {
    ...Widget(connection),
    sendMessage,
    getCustomerProfile(): ICustomerProfile | null {
      return customerProfile;
    },
    getCustomerProfileHidden(): ICustomerProfile | null {
      return customerProfileHidden;
    },
    putMessage(text: string): Promise<void> {
      return sendMessage('put_message', text);
    },
    watchMessages(): Promise<void> {
      return sendMessage('watch_messages');
    },
    refreshSession(): Promise<void> {
      return sendMessage('plugin_loaded');
    },
    modifySection(section: ISection): Promise<void> {
      assertSection(section);
      return sendMessage('customer_details_section', section);
    }
  };

  const widget: IDetailsWidget = pipe(
    withAmplitude,
    withRichMessages
  )(base);

  return widget;
}

export default function createDetailsWidget(): Promise<IDetailsWidget> {
  return createConnection().then(connection => DetailsWidget(connection));
}
