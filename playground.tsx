import { cdpPersonalize } from './dist';

cdpPersonalize.initialize(
  'key',
  'targetApi',
  'cookieDomain',
  'pos',
  'flowTarget'
);

type customReponse = {
  userInterest: String;
  otherProperies: Boolean;
};

cdpPersonalize
  .callFlows<customReponse>({
    friendlyId: 'CDP_PERSONALIZE_FLOW_FRIENDLY_ID', // required
    otherPropsYouNeed: 'example value', // optioanlly, send any other properties you need
  })
  .then(response => {
    console.log(response.userInterest);
  });
