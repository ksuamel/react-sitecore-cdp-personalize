import { logError } from './logger';
import {
  Boxever,
  BoxeverQueueFunctionType,
  BrowserShowResponse,
  EventCreateResponse,
} from './types';

declare global {
  interface Window {
    _boxever_settings: {
      client_key: string;
      target: string;
      cookie_domain: string;
    };
    Boxever: Boxever;
    _boxever: Boxever;
    _boxeverq: BoxeverQueueFunctionType[];
    __boxeverQueue: {
      new (): [];
    };
    BoxeverJERS: {
      errors: unknown[];
    };
  }
}

export class CdpPersonalize {
  private clientKey!: string;
  private targetApi!: string;
  private cookieDomain!: string;
  private pointOfSale!: string;
  private webFlowTarget!: string;
  private libraryVersion: string = '1.4.9';
  private currency: string = 'USD';
  private channel: string = 'WEB';
  private language: string = 'EN';

  private scriptId: string = 'cdpPersonalizeScript';

  initialize = (
    clientKey: string,
    targetApi: string,
    cookieDomain: string,
    pointOfSale: string,
    webFlowTarget: string,
    libraryVersion?: string,
    currency?: string,
    channel?: string,
    langauge?: string
  ): void => {
    this.clientKey = clientKey;
    this.targetApi = targetApi;
    this.cookieDomain = cookieDomain;
    this.pointOfSale = pointOfSale;
    this.webFlowTarget = webFlowTarget;
    if (libraryVersion) {
      this.libraryVersion = libraryVersion;
    }
    if (currency) {
      this.currency = currency;
    }
    if (channel) {
      this.channel = channel;
    }
    if (langauge) {
      this.language = langauge;
    }
  };

  renderScript = (): void => {
    if (!this.isInitialized) {
      logError('Initialize before attempting to render the script.');
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

  trackPage = (): Promise<EventCreateResponse> => {
    return this.eventCreate({
      type: 'VIEW',
    });
  };

  getBrowserId = (): Promise<string> => {
    return new Promise<string>(async resolve => {
      this.waitForBoxever().then(() => {
        resolve(window.Boxever.getID());
      });
    });
  };

  getGuestRef = (): Promise<string> => {
    return new Promise<string>(async resolve => {
      var data = await this.browserShow();
      resolve(data.customer.ref as string);
    });
  };

  identifyByEmail = (
    email: string,
    additionalData?: Record<string, unknown>
  ): Promise<EventCreateResponse> => {
    const finalPayload = {
      email: email,
      ...additionalData,
    };
    return this.identifyByProvider('email', email, finalPayload);
  };

  identifyByProvider = (
    provider: string,
    id: string,
    additionalData?: Record<string, unknown>
  ): Promise<EventCreateResponse> => {
    const identifyEvent: Record<string, unknown> = {
      type: 'IDENTITY',
      identifiers: [
        {
          provider: provider,
          id: id,
        },
      ],
    };

    let finalPayload = identifyEvent;
    if (additionalData) {
      finalPayload = { ...identifyEvent, ...additionalData };
    }

    return this.eventCreate(finalPayload);
  };

  eventCreate = (
    event: Record<string, unknown>
  ): Promise<EventCreateResponse> => {
    return new Promise<EventCreateResponse>(resolve => {
      this.waitForBoxever().then(async () => {
        const eventPayload = {
          page: window.location.pathname + window.location.search,
          currency: this.currency,
          pos: this.pointOfSale,
          browser_id: await this.getBrowserId(),
          channel: this.channel,
          language: this.language,
          ...event,
        };

        window.Boxever.eventCreate(
          eventPayload,
          data => {
            resolve(data);
          },
          'json'
        );
      });
    });
  };

  browserShow = async (browserId?: string): Promise<BrowserShowResponse> => {
    return new Promise<BrowserShowResponse>(resolve => {
      this.waitForBoxever().then(async () => {
        const bid = browserId ?? (await this.getBrowserId());
        window.Boxever.browserShow(
          bid,
          this.clientKey,
          data => resolve(data),
          'json'
        );
      });
    });
  };

  private isInitialized = (): boolean => {
    if (!this.clientKey || this.clientKey.length === 0) {
      logError('Missing Client Key');
      return false;
    }

    if (!this.targetApi || this.targetApi.length === 0) {
      logError('Missing Target API');
      return false;
    }

    if (!this.cookieDomain || this.cookieDomain.length === 0) {
      logError('Missing Cookie Domain');
      return false;
    }

    if (!this.pointOfSale || this.pointOfSale.length === 0) {
      logError('Missing Point of Sale');
      return false;
    }

    if (!this.webFlowTarget || this.webFlowTarget.length === 0) {
      logError('Missing Web Flow Target');
      return false;
    }

    return true;
  };

  private waitForBoxever = (): Promise<void> => {
    return new Promise<void>(async resolve => {
      while (
        !window.Boxever ||
        window.Boxever.getID() === 'anonymous' ||
        !window._boxeverq
      ) {
        await new Promise(r => setTimeout(r, 150));
      }

      resolve();
    });
  };
}
