import { IWidget } from '../widget';

export interface IWidgetWithRichMessages {
  sendQuickReplies(title, buttons): Promise<void>;
  sendCards(cards): Promise<void>;
}

export default function withRichMessages<Widget extends IWidget>(
  widget: Widget
): Widget & IWidgetWithRichMessages {
  return {
    ...widget,
    sendQuickReplies(title, buttons) {
      return this.sendMessage('send_quick_replies', { title, buttons });
    },
    sendCards(cards) {
      return this.sendMessage(
        'send_cards',
        Array.isArray(cards) ? cards : [cards]
      );
    }
  };
}
