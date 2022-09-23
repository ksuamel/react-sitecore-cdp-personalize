export class CdpPersonalize {
  private clientKey!: string;
  private targetApi!: string;
  private cookieDomain!: string;
  private pointOfSale!: string;
  private webFlowTarget!: string;
  private libraryVersion: string = '1.4.9';

  private scriptId: string = 'cdpPersonalizeScript';

  constructor() {
    console.log('Initialized');
  }

  initialize = (
    clientKey: string,
    targetApi: string,
    cookieDomain: string,
    pointOfSale: string,
    webFlowTarget: string,
    libraryVersion?: string
  ): void => {
    this.clientKey = clientKey;
    this.targetApi = targetApi;
    this.cookieDomain = cookieDomain;
    this.pointOfSale = pointOfSale;
    this.webFlowTarget = webFlowTarget;
    if (libraryVersion) {
      this.libraryVersion = libraryVersion;
    }
  };

  renderScript = (): void => {
    if (!this.isInitialized) {
      this.error('Initialize before attempting to render the script.');
    }

    const scriptAlreadyRendered = document.getElementById(this.scriptId);
    if (scriptAlreadyRendered) {
      return;
    }

    const script = () => {
      const script = document.createElement('script');
      script.id = this.scriptId;
      script.innerHTML = `
        var _boxeverq = _boxeverq || [];
    
        var _boxever_settings = {
            client_key: '${this.clientKey}',
            target: '${this.targetApi}',
            cookie_domain: '${this.cookieDomain}',
            pointOfSale: '${this.pointOfSale}',
            web_flow_target: '${this.webFlowTarget}',
            web_flow_config: { async: false, defer: false }
        };
    
        (function() {
            var s = document.createElement('script'); s.type = 'text/javascript'; s.async = true; 
            s.src = 'https://d1mj578wat5n4o.cloudfront.net/boxever-${this.libraryVersion}.min.js';\
            var x = document.getElementsByTagName('script')[0]; x.parentNode.insertBefore(s, x);
        })();
      `;
      return script;
    };
    document.body.appendChild(script());
  };

  getBrowserId = (): string => {
    return this.getCookieValue(`bid_${this.clientKey}`);
  };

  getGuestRef = (): Promise<string> => {
    return new Promise<string>(async resolve => {
      var data = await this.browserShow();
      resolve(data.customer.ref as string);
    });
  };

  eventCreate = (
    event: Record<string, unknown>
  ): Promise<eventCreateResponse> => {
    return new Promise<eventCreateResponse>(resolve => {
      window.Boxever.eventCreate(
        event,
        data => {
          resolve(data);
        },
        'json'
      );
    });
  };

  browserShow = (browserId?: string): Promise<browserShowResponse> => {
    const bid = browserId ?? this.getBrowserId();

    return new Promise<browserShowResponse>(resolve => {
      window.Boxever.browserShow(
        bid,
        this.clientKey,
        data => resolve(data),
        'json'
      );
    });
  };

  private isInitialized = (): boolean => {
    if (!this.clientKey || this.clientKey.length === 0) {
      this.error('Missing Client Key');
      return false;
    }

    if (!this.targetApi || this.targetApi.length === 0) {
      this.error('Missing Target API');
      return false;
    }

    if (!this.cookieDomain || this.cookieDomain.length === 0) {
      this.error('Missing Cookie Domain');
      return false;
    }

    if (!this.pointOfSale || this.pointOfSale.length === 0) {
      this.error('Missing Point of Sale');
      return false;
    }

    if (!this.webFlowTarget || this.webFlowTarget.length === 0) {
      this.error('Missing Web Flow Target');
      return false;
    }

    return true;
  };

  private error = (message: string) => {
    console.error(`react-sitecore-cdp-personalize: ${message}`);
  };

  private getCookieValue = (name: string) =>
    document.cookie.match('(^|;)\\s*' + name + '\\s*=\\s*([^;]+)')?.pop() || '';
}

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

interface browserShowResponse {
  customer: Record<string, unknown>;
}

type browserShowCallbackType = (
  // eslint-disable-next-line no-unused-vars
  data: browserShowResponse
) => void;

interface Boxever {
  getID(): string;
  eventCreate(
    // eslint-disable-next-line no-unused-vars
    payload: Record<string, unknown>,
    // eslint-disable-next-line no-unused-vars
    callback: eventCreateCallbackType,
    // eslint-disable-next-line no-unused-vars
    format: string
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
  browserShow(
    browserId: string,
    clientKey: string,
    callback: browserShowCallbackType,
    format: string
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
