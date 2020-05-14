export interface IDetailsWidgetApi {
  putMessage(text: string): Promise<void>;
  watchMessages(): Promise<void>;
  refreshSession(): Promise<void>;
  modifySection(section: ISection): Promise<void>;
}

export interface IDetailsWidgetEvents {
  message: IMessage;
  customer_details_section_button_click: ICustomerDetailsSectionButtonClick;
  message_box_text: IMessageBoxText;
}

export interface IMessage {
  chat: string;
  message: string;
  message_id: string;
  message_source: string;
}

export interface ICustomerDetailsSectionButtonClick {
  buttonId: string;
}

export interface IMessageBoxText {
  value: string;
}

export interface ISection {
  title: string;
  components: SectionComponent[];
  imgUrl?: string;
  openApp?: boolean;
}

export type SectionComponent =
  | IButtonComponent
  | ILabelComponent
  | ILineComponent
  | ILinkComponent
  | ITitleComponent
  | ICustomerComponent
  | ITagsComponent;

export enum SectionComponentType {
  Button = 'button',
  LabelValue = 'label_value',
  Title = 'title',
  Link = 'link',
  Line = 'line',
  Customer = 'customer',
  Tags = 'tags'
}

export interface IButtonComponent {
  type: SectionComponentType.Button;
  data: {
    label: string;
    id: string;
    openApp?: boolean;
    primary?: boolean;
    secondary?: boolean;
  };
}

export interface ILabelComponent {
  type: SectionComponentType.LabelValue;
  data: {
    label?: string;
    value?: string;
    iconUrl?: string;
    url?: string;
  };
}

export interface ILineComponent {
  type: SectionComponentType.Line;
}

export interface ILinkComponent {
  type: SectionComponentType.Link;
  data: {
    url: string;
    value?: string;
    inline?: boolean;
  };
}

export interface ITitleComponent {
  type: SectionComponentType.Title;
  data: {
    title: string;
    value?: string;
    description?: string;
    imgUrl?: string;
    imgSize?: 'big' | 'small';
    link?: string;
    id?: string;
    clickable?: boolean;
    openApp?: boolean;
  };
}

export interface ICustomerComponent {
  type: SectionComponentType.Customer;
}

export interface ITagsComponent {
  type: SectionComponentType.Tags;
  data: {
    tags: string[];
    label?: string;
  };
}
