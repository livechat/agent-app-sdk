# LiveChat Agent App SDK

This SDK is a set of tools that will help you integrate your apps with the [LiveChat Agent App](https://my.livechatinc.com/).

For full documentation please head to [LiveChat Docs](https://developers.livechatinc.com/docs/extending-ui/extending-agent-app/).

## Installation

The package can be installed directly from NPM.

```
npm install --save @livechat/agent-app-sdk
```

The NPM package is distributed both as a CommonJS and ES6 module. It should be used together with a module bundler, such as Webpack or Rollup.

We also distrubute a UMD build of the package, which can be used directly in the browser.

```html
<script src="https://unpkg.com/@livechat/agent-app-sdk@latest/dist/agentapp.umd.min.js"></script>
```

## Basic usage

Use one of the methods exported by the SDK.

### `createDetailsWidget(): Promise<IDetailsWidget>`

Creates a widget instance to be used in the Chat Details context.

```js
import { createDetailsWidget } from ‘@livechat/agent-app-sdk’;

createDetailsWidget().then(widget => {
  // do something with the widget
});
```

### `createMessageBoxWidget(): Promise<IDetailsWidget>`

Creates a widget instance to be used in MessageBox.

```js
import { createMessageBoxWidget } from ‘@livechat/agent-app-sdk’;

createMessageBoxWidget().then(widget => {
  // do something with the widget
});
```

### `createFullscreenWidget(): Promise<IFullscreenWidget>`

Creates a widget instance to be used as a Fullscreen app.

```js
import { createFullscreenWidget } from ‘@livechat/agent-app-sdk’;

createFullscreenWidget().then(widget => {
  // do something with the widget
});
```

## Widgets (`IWidget`)

All widgets share a common interface.

- `on(eventName: string, eventHandler: (data: any) => void): void`) - registers the event handler to be called when a given event occurs

- `off(eventName: string, eventHandler: (data: any) => void): void`) - unregisters the previously registered handler from the event

You can use it to track the events happening in the Agent App.

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

Each widget type offers a different set of events that you can listen to. Check them out in the descriptions below.

## Details widget (`IDetailsWidget`)

A type of widget that has access to the Chat Details context.

### Events

#### `customer_profile`

Emitted when an agent opens a conversation within Chats, Archives, or the customer profile in the Customers sections. The handler will get the customer profile object as an argument:

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
  chat: {
    id?: string;
    groupID: string;
    preChatSurvey: { question: string; answer: string }[];
  };
  source: 'chats' | 'archives' | 'customers';
}
```

#### `customer_details_section_button_click`

Emitted when agent clicks a button located in a custom section in Customer Details. The handler gets the following payload:

```ts
interface ICustomerDetailsSectionButtonClick {
  buttonId: string;
}
```

The `buttonId` property reflects the `id` specified for the button in the section definition.

### Methods

#### `getCustomerProfile(): ICustomerProfile | null`

Gets the customer profile recorded most recently. Returns the `ICustomerProfile` object, which is identical to the one emitted by the `customer_profile` event or `null` (if no profile was registered).

#### `putMessage(text: string): Promise<void>`

Appends the text to the message box of the currently opened chat.

#### `modifySection(section): Promise<void>`

With this method, you can modify any custom section declared in the widget's initial state in Developers Console. The `section` argument should be an object implementing the section defintion interface, for example:

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

The `title` of a given section has to match the one specified in the initial state. Otherwise, the section won't change. Also, the Agent App ignores the commands without valid section definitions. Make sure that the definition you're sending is correct.

## MessageBox widget (`IMessageBoxWidget`)

### Events

#### `customer_profile`

Emitted after the widget is opened in the MessageBox. The handler will get a `ICustomerProfile` object (check the documentation for the `customer_profile` event in the [Details widget](#details-widget-idetailswidget) to see the how the object is structured).

#### `message_sent`

Emitted after the message is sent by the agent. Keep in mind that the message has to be set with [`putMessage`] method in order to be sent.

### Methods

#### `putMessage(msg: IRichMessage | string): Promise<void>`

Sets a message to be stored by MessageBox. Calling this method does not automatically send the message right away. The message is sent once an agent clicks the _Send_ button. The message accepts the regular message type as `string` or rich messages. The latter must implement the `IRichMessage` interface.

```javascript
const richMessage = {
  template_id: 'cards',
  elements: [
    {
      title: 'My cat photo',
      image: 'imgs/john-the-cat.jpg'
    }
  ]
};

widget.putMessage(richMessage);
```

#### `getCustomerProfile(): ICustomerProfile | null`

Gets the customer profile recorded most recently. Returns the `ICustomerProfile` object, which is identical to the one emitted by the `customer_profile` event or `null` (if no profile was registered).

### Rich Message object format

- `custom_id`, `properties` and `elements` are optional
- `elements` may contain 1-10 element objects
- all `elements` properties are optional: `title`, `subtitle`, `image`, and `buttons`
- property `url` on `image` is required
- optional `image` properties: `name`, `content_type`, `size`, `width`, and `height`
- `buttons` may contain 1-11 button objects
- `template_id` describes how the event should be presented in an app
- `elements.buttons.postback_id` describes the action sent via the `send_rich_message_postback` method
- multiple buttons (even from different elements) can contain the same `postback_id`; calling `send_rich_message_postback` with this id will add a user to all these buttons at once.
- `elements.buttons.user_ids` describes users who sent the postback with `"toggled": true`

## Fullscreen widget (`IFullscreenWidget`)

### Events

This widget currently does not support any events.

### Methods

#### `setNotificationBadge(count: number | null): Promise<void>`

Displays a red badge on top of the Fullscreen app icon. Use this to notify Agents there’s something important inside the widget. Make sure Agents can dismiss the notification to avoid cluttered UI.
