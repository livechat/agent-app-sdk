import { WidgetMixin } from './widget';

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
  chat: {
    id: string;
    groupID: string;
    preChatSurvey?: { question: string; answer: string }[];
  };
  source: 'chats' | 'archives' | 'customers';
}

export interface ICustomerProfileApi {
  getCustomerProfile(): ICustomerProfile | null;
}

export interface ICustomerProfileEvents {
  customer_profile: ICustomerProfile;
}

export const withCustomerProfile: WidgetMixin<
  ICustomerProfileApi,
  ICustomerProfileEvents
> = widget => {
  let customerProfile = null;

  function onCustomerProfile(profile: ICustomerProfile) {
    customerProfile = profile;
  }

  widget.on('customer_profile', onCustomerProfile);

  return {
    ...widget,
    getCustomerProfile(): ICustomerProfile | null {
      return customerProfile;
    }
  };
};
