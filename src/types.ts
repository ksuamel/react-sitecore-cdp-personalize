export type BoxeverQueueFunctionType = () => void;

export interface EventCreateResponse {
  status: string;
}

type EventCreateCallbackType = (response: EventCreateResponse) => void;

type CallFlowsCallbackType = (response: unknown) => void;

interface BrowserCreateResponse {
  ref: string;
}

type BrowserCreateCallbackType = (data: BrowserCreateResponse) => void;

export interface BrowserShowResponse {
  customer: Record<string, unknown>;
}

type BrowserShowCallbackType = (data: BrowserShowResponse) => void;

type GetBucketNumberCallbackType = () => void;

export interface Boxever {
  getID(): string;
  eventCreate(
    payload: Record<string, unknown>,
    callback: EventCreateCallbackType,
    format: string
  ): void;
  callFlows(
    payload: Record<string, unknown>,
    callback: CallFlowsCallbackType,
    type: string
  ): void;
  storage: {
    removeItem(name: string): void;
    setItem(
      name: string,
      browserId: string,
      cookieExpiresDays: number | { TTL: number }
    ): void;
  };
  cookie_name: string;
  browserCreate(
    payload: Record<string, unknown>,
    callback: BrowserCreateCallbackType,
    type: string
  ): void;
  browserShow(
    browserId: string,
    clientKey: string,
    callback: BrowserShowCallbackType,
    format: string
  ): void;
  addUTMParams(event: Record<string, unknown>): void;
  getBucketNumber(callback: GetBucketNumberCallbackType): void;
  getCookie(cookieName: string): string;
  getClientKey(): string;
  reset(): void;
  triggerExperiences(): void;
  browser_id: string;
  isITPBrowser: boolean;
  cookie_expires_days: number;
  storage_ttl: number;
  initWebFlowSDK(): void;
}
