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

  /**
   * Merge new threads with previously received threads
   */
  function onPrivateMode(privateMode: IPrivateMode) {
    console.log('@onPrivateMode', privateMode);
    threads = { ...threads, ...privateMode.threads };
    console.log('@threads', threads);
  }

  widget.on('private_mode', onPrivateMode);

  return {
    ...widget,
    getPrivateModeThreads(): IPrivateMode | null {
      return threads;
    }
  };
};
