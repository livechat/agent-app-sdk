import { createWidget } from '../shared/widget';
import { withAmplitude } from '../shared/amplitude';
import { IConnection, createConnection } from '../connection';
import { IFullscreenWidgetApi, IFullscreenWidgetEvents } from './interfaces';
import { PluginMessage, PluginType } from '../connection/constants';

function FullscreenWidget(connection: IConnection<IFullscreenWidgetEvents>) {
  const base = createWidget<IFullscreenWidgetApi, IFullscreenWidgetEvents>(
    connection,
    {
      setNotificationBadge(count: number | null): Promise<void> {
        return connection.sendMessage(
          'set_fullscreen_widget_notification_badge',
          count
        );
      }
    }
  );
  return withAmplitude(base);
}

export interface IFullscreenWidget
  extends ReturnType<typeof FullscreenWidget> {}

export default function createFullscreenWidget(): Promise<IFullscreenWidget> {
  let widget: IFullscreenWidget;
  return createConnection<IFullscreenWidgetEvents>()
    .then(connection => {
      return connection.sendMessage(PluginMessage.Inited, {
        plugin_type: PluginType.Fullscreen
      }).then(() => FullscreenWidget(connection));
    });
}
