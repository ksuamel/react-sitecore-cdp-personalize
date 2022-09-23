# React Sitecore CDP and Personalize

The react-sitecore-cdp-personalize library is used to quickly integrate with Sitecore CDP and Personalize.

# Features

- Typescript Support
- Easy to use wrapper over Boxever (Sitecore CDP and Personalize) JavaScript Library

# Usage

## Client Side

```js
import { cdpPersonalize } from 'react-sitecore-cdp-personalize';

//Configure
cdpPersonalize.initialize(
  '[CLIENT_KEY]',
  '[API_TARGET]',
  '[COOKIE_DOMAIN]',
  '[POINT_OF_SALE]',
  '[WEB_FLOW_TARGET]'
);

//Add script to head (will only add it once if called multiple times)
cdpPersonalize.renderScript();

//Track Pages

//Identify Users

//Trigger Events
```

## Direct API calls / Server Side

TBD

# Client Side Methods

# Server Side Methods
