import { IWidget } from '../widget';
import { IWidgetWithAmplitude } from '../common/amplitude';
import { IWidgetWithRichMessages } from '../common/rich-messages';
import { ConnectionEmitter } from '../connection';

export interface IDetailWidgetEvents {
  customer_profile: ICustomerProfile;
  customer_profile_hidden: ICustomerProfileHidden;
  message: IMessage;
  customer_details_section_button_click: ICustomerDetailsSectionButtonClick;
  message_box_text: IMessageBoxText;
}

export interface IDetailsWidget
  extends IWidget,
    IWidgetWithAmplitude,
    IWidgetWithRichMessages {
  on: ConnectionEmitter<IDetailWidgetEvents>['on'];
  off: ConnectionEmitter<IDetailWidgetEvents>['off'];
  getCustomerProfile(): ICustomerProfile | null;
  getCustomerProfileHidden(): ICustomerProfileHidden | null;
  putMessage(text: string): Promise<void>;
  watchMessages(): Promise<void>;
  refreshSession(): Promise<void>;
  modifySection(section: ISection): Promise<void>;
}

export interface ICustomerProfile {
  id: string;
  name: string;
  geolocation: {
    longitude?: string;
    latitude?: string;
    country: string;
    country_code: string;
    region: string;
    city: string;
    timezone: string;
  };
  email?: string;
  chat:
    | {
        id: string;
        groupID: string;
      }
    | {};
  source: 'chats' | 'archives' | 'customers';
}

export interface ICustomerProfileHidden {
  id: string;
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
}

export type SectionComponent =
  | IButtonComponent
  | ILabelComponent
  | ILineComponent
  | ILinkComponent
  | ITitleComponent;

export enum SectionComponentType {
  Button = 'button',
  LabelValue = 'label_value',
  Title = 'title',
  Link = 'link',
  Line = 'line'
}

export interface IButtonComponent {
  type: SectionComponentType.Button;
  data: {
    label: string;
    id: string;
    openApp?: boolean;
  };
}

export interface ILabelComponent {
  type: SectionComponentType.LabelValue;
  data: {
    label?: string;
    value?: string;
    inline?: boolean;
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
  };
}
