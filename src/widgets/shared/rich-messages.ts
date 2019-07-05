import { WidgetMixin } from './widget';

export interface IRichMessagesApi {
  sendQuickReplies(title, buttons): Promise<void>;
  sendCards(cards): Promise<void>;
}

export const withRichMessages: WidgetMixin<IRichMessagesApi, {}> = widget => ({
  ...widget,
  sendQuickReplies(title, buttons) {
    return widget.sendMessage('send_quick_replies', { title, buttons });
  },
  sendCards(cards) {
    return widget.sendMessage(
      'send_cards',
      Array.isArray(cards) ? cards : [cards]
    );
  }
});
