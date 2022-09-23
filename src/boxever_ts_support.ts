export const fix = () => {};

type boxeverQueueFunctionType = () => void;

interface eventCreateResponse {
  status: string;
}

type eventCreateCallbackType = (
  // eslint-disable-next-line no-unused-vars
  response: eventCreateResponse
) => void;

type callFlowsCallbackType = (
  // eslint-disable-next-line no-unused-vars
  response: unknown
) => void;

interface browserCreateResponse {
  ref: string;
}

type browserCreateCallbackType = (
  // eslint-disable-next-line no-unused-vars
  data: browserCreateResponse
) => void;

interface Boxever {
  getID(): string;
  eventCreate(
    // eslint-disable-next-line no-unused-vars
    payload: Record<string, unknown>,
    // eslint-disable-next-line no-unused-vars
    callback: eventCreateCallbackType,
    // eslint-disable-next-line no-unused-vars
    type: string
  ): void;
  callFlows(
    // eslint-disable-next-line no-unused-vars
    payload: Record<string, unknown>,
    // eslint-disable-next-line no-unused-vars
    callback: callFlowsCallbackType,
    // eslint-disable-next-line no-unused-vars
    type: string
  ): void;
  storage: {
    removeItem(
      // eslint-disable-next-line no-unused-vars
      name: string
    ): void;
    setItem(
      // eslint-disable-next-line no-unused-vars
      name: string,
      // eslint-disable-next-line no-unused-vars
      browserId: string,
      // eslint-disable-next-line no-unused-vars
      cookieExpiresDays: number | { TTL: number }
    ): void;
  };
  cookie_name: string;
  browserCreate(
    // eslint-disable-next-line no-unused-vars
    payload: Record<string, unknown>,
    // eslint-disable-next-line no-unused-vars
    callback: browserCreateCallbackType,
    // eslint-disable-next-line no-unused-vars
    type: string
  ): void;
  browser_id: string;
  isITPBrowser: boolean;
  cookie_expires_days: number;
  storage_ttl: number;
  initWebFlowSDK(): void;
}

declare global {
  interface Window {
    _boxever_settings: {
      client_key: string;
      target: string;
      cookie_domain: string;
    };
    Boxever: Boxever;
    _boxever: Boxever;
    _boxeverq: boxeverQueueFunctionType[];
    __boxeverQueue: {
      new (): [];
    };
    BoxeverJERS: {
      errors: unknown[];
    };
  }
}
