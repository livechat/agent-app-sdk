import { KeyMap } from '../../utils/types';
import { WidgetMixin, Widget, AnyWidgetApi } from './widget';

export interface IPrivateModeUpdate {
  threads: KeyMap<boolean>;
  source: 'chats';
}

export interface IPrivateModeApi {
  getPrivateModeState(): IPrivateModeUpdate | null;
}

export interface IPrivateModeEvents {
  private_mode: IPrivateModeUpdate;
}

export const withPrivateMode: WidgetMixin<
  IPrivateModeApi,
  IPrivateModeEvents
> = widget => {
  let threads = null;

  function onPrivateMode(privateMode: IPrivateModeUpdate) {
    threads = { ...threads, ...privateMode.threads };
  }

  widget.on('private_mode', onPrivateMode);

  return {
    ...widget,
    getPrivateModeState(): IPrivateModeUpdate | null {
      return { source: 'chats', threads };
    }
  };
};
