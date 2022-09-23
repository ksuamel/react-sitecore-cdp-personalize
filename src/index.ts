import * as globalSupport from './boxever_ts_support';
globalSupport.fix();

class CdpPersonalize {
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

  initialize(
    clientKey: string,
    targetApi: string,
    cookieDomain: string,
    pointOfSale: string,
    webFlowTarget: string,
    libraryVersion?: string
  ) {
    this.clientKey = clientKey;
    this.targetApi = targetApi;
    this.cookieDomain = cookieDomain;
    this.pointOfSale = pointOfSale;
    this.webFlowTarget = webFlowTarget;
    if (libraryVersion) {
      this.libraryVersion = libraryVersion;
    }
  }

  renderScript = () => {
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

  private isInitialized = () => {
    if (!this.clientKey || this.clientKey.length == 0) {
      this.error('Missing Client Key');
      return false;
    }

    if (!this.targetApi || this.targetApi.length == 0) {
      this.error('Missing Target API');
      return false;
    }

    if (!this.cookieDomain || this.cookieDomain.length == 0) {
      this.error('Missing Cookie Domain');
      return false;
    }

    if (!this.pointOfSale || this.pointOfSale.length == 0) {
      this.error('Missing Point of Sale');
      return false;
    }

    if (!this.webFlowTarget || this.webFlowTarget.length == 0) {
      this.error('Missing Web Flow Target');
      return false;
    }
  };

  private error = (message: string) => {
    console.error(`react-sitecore-cdp-personalize: ${message}`);
  };
}

export const cdpPersonalize = new CdpPersonalize();
