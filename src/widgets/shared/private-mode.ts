import { KeyMap } from '../../utils/types';
import { WidgetMixin } from './widget';

export interface IPrivateModeData {
  threads: KeyMap<boolean>;
  source: 'chats';
}

export interface IPrivateModeApi {
  getPrivateModeState(): IPrivateModeData | null;
}

export interface IPrivateModeEvents {
  private_mode: IPrivateModeData;
}

export const withPrivateMode: WidgetMixin<
  IPrivateModeApi,
  IPrivateModeEvents
> = widget => {
  let threads = null;

  function onPrivateMode(privateMode: IPrivateModeData) {
    threads = { ...threads, ...privateMode.threads };
  }

  widget.on('private_mode', onPrivateMode);

  return {
    ...widget,
    getPrivateModeState(): IPrivateModeData | null {
      return { source: 'chats', threads };
    }
  };
};
