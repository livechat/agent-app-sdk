import { IWidget } from '../widget';

export interface IWidgetWithAmplitude {
  trackEvent(name: string, properties: object): Promise<void>;
}

export default function withAmplitude<Widget extends IWidget>(
  widget: Widget
): Widget & IWidgetWithAmplitude {
  return {
    ...widget,
    trackEvent(name: string, properties: object): Promise<void> {
      if (typeof name !== 'string' || typeof properties !== 'object') {
        throw new Error(
          'You have to specify the event name and its properties'
        );
      }

      return this.sendMessage('track', {
        event_name: name,
        event_properties: properties
      });
    }
  };
}
