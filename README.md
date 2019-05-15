# LiveChat Agent App SDK

This SDK is a set of tools that will help you integrate your apps with [LiveChat's Agent App](https://my.livechatinc.com/).

## Instalation

The package can be installed directly from NPM.

```
npm install --save @livechat/agent-app-sdk
```

The NPM package is distrubted both as a CommonJS and ES6 module and it should be used together with a module bundler like Webpack or Rollup.

We also distrubute an UMD build of the package that can be used directly in the browser.

```html
<script src="https://unpkg.com/@livechat/agent-app-sdk@latest/dist/agentapp.umd.min.js"></script>
```

## Basic usage

Just use one of the methods exported by the SDK.

### `createDetailsWidget(): Promise<IDetailsWidget>`

Creates a widget instance to be used in the Chat Details context.

```js
import { createDetailsWidget } from ‘@livechat/agent-app-sdk’;

createDetailsWidget().then(widget => {
  // do something with the widget
});
```

## Widgets (`IWidget`)

All widgets share a common interface.

- `on(eventName: string, eventHandler: (data: any) => void): void`) - register the event handler to be called when the given event occurs

- `off(eventName: string, eventHandler: (data: any) => void): void`) - unregister the previously registered handler from the event

You can use it to track events happening in the Agent App.

```js
import { createDetailsWidget } from ‘@livechat/agent-app-sdk’;

createDetailsWidget().then(widget => {
  function onCustomerProfile(profile) {
    // do something with the profile when it changes
  }

  // register when you need it
  widget.on(‘customer_profile’, onCustomerProfile);

  // ...

  // unregister when you’re done
  widget.off(‘customer_profile’, onCustomerProfile);
});
```

Each type of widget offers a different set of events that you can listen to. Check them out in the descriptions below.

## Details widget (`IDetailsWidget`)

A type of widget that has access to the Chat Details context.

### Events

#### `customer_profile`

Emitted when the agent opens a conversation within Chats, Archives or the customer profile in the Customers sections. The handler will be passed a customer profile object:

```ts
interface ICustomerProfile {
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
```

#### `message`

Emitted on every chat message (both outgoing and incoming). You have to enable the event using the `watchMessages` method first in order to use it. The handler gets the message object:

```ts
interface IMessage {
  chat: string;
  message: string;
  message_id: string;
  message_source: string;
}
```

#### `customer_details_section_button_click`

Emitted when a button within a custom section is clicked in Customer Details. The handler is passed the following payload:

```ts
interface ICustomerDetailsSectionButtonClick {
  buttonId: string;
}
```

The `buttonId` property reflects the `id` specified for the button in the section definition.

### Methods

#### `getCustomerProfile(): ICustomerProfile | null`

Get the last recorded profile of the customer. Returns the `ICustomerProfile` object identical to the one emitted by the `customer_profile` event or `null` if none profile was registered.

#### `putMessage(text: string): Promise<void>`

Append the text to the message box of the currently opened chat.

#### `watchMessages(): Promise<void>`

Opt into receiving the `message` event.

#### `modifySection(section): Promise<void>`

This method allows you to modify any custom section that you declared in the initial state of the widget in the Developers Console. The `section` argument should be an object implementing the section defintion interface, for example:

```javascript
const section = {
  title: ‘My section’,
  components: [
    // …
    {
      type: ‘button’,
      data: {
        label: ‘My section button’,
        id: ‘section-button’
      }
    }
    // …
  ]
};

widget.modifySection(section);
```

The given section `title` must match the one specified in the initial state, otherwise the section won't change. Also, Agent App ignores commands that do not contain a valid section definition, so make sure that
definition you're sending is correct.
