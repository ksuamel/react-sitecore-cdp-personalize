import { cdpPersonalize } from './dist';

cdpPersonalize.initialize(
  'key',
  'targetApi',
  'cookieDomain',
  'pos',
  'flowTarget'
);

cdpPersonalize.getClientKey().then(clientKey => {
  console.log(clientKey);
});

cdpPersonalize.reset().then(() => {
  console.log('Values reset');
});

cdpPersonalize.triggerExperiences().then(() => {
  console.log('Experiences triggered');
});
