export interface IMessageBoxWidgetApi {
  putMessage(message: IRichMessage | string): void;
}

export interface IMessageBoxWidgetEvents {
  message_sent: undefined;
}

export interface IRichMessage {
  template_id: 'cards' | 'quick_replies';
  elements: IRichMessageElement[];
}

interface IRichMessageElement {
  title?: string;
  subtitle?: string;
  image?: IRichMessageImage;
  buttons?: IRichMessageButton[];
}

interface IRichMessageImage {
  name?: string;
  url: string;
  content_type?: string;
  size?: number;
  width?: number;
  height?: number;
}

interface IRichMessageButton {
  text: string;
  type?: string;
  value: string | number;
  // postback_id describes the action sent via "send_rich_message_postback" method
  postback_id?: string;
  // user_ids describes users that sent the postback with "toggled": true
  user_ids?: string[];
}
