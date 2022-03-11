import { KeyMap } from '../../utils/types';
import { WidgetMixin, Widget, AnyWidgetApi } from './widget';

export interface IPrivateMode {
  threads: KeyMap<boolean>;
  source: 'chats';
}

export interface IPrivateModeApi {
  getPrivateModeThreads(): IPrivateMode | null;
}
export interface IPrivateModeEvents {
  private_mode: IPrivateMode;
}

export const withPrivateMode: WidgetMixin<
  IPrivateModeApi,
  IPrivateModeEvents
> = widget => {
  let threads = null;

  function onPrivateMode(privateMode: IPrivateMode) {
    threads = { ...threads, ...privateMode.threads };
  }

  widget.on('private_mode', onPrivateMode);

  return {
    ...widget,
    getPrivateModeThreads(): IPrivateMode | null {
      return threads;
    }
  };
};
