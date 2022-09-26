# Sitecore CDP and Personalize

The sitecore-cdp-personalize library is used to quickly integrate with Boxever (Sitecore CDP and Personalize) JavaScript Library.

# Features

- Typescript Support
- Easy to use wrapper over Boxever (Sitecore CDP and Personalize) JavaScript Library
- Retry mechanism to ensure Boxever is properly loaded
- Promise-based

# Usage

**Installaion**

```js
npm install sitecore-cdp-personalize
```

**Core Setup**

```js
import { cdpPersonalize } from 'sitecore-cdp-personalize';

//Configure CDP and Personalize, and injects Boxever (CDP and Personalize) JavaScript Library into page
cdpPersonalize.initialize(
  '[CLIENT_KEY]',
  '[API_TARGET]',
  '[COOKIE_DOMAIN]',
  '[POINT_OF_SALE]',
  '[WEB_FLOW_TARGET]',
  '[LIBRARY_VERSION]', // optional, defaults to 1.4.9
  '[CURRENCY]', // optional, defaults to USD
  '[CHANNEL]', // optional, defaults to WEB
  '[LANGAUGE]' // optional, defaults to EN
);
```

**Common methods**

```js
//Identify Users
cdpPersonalize.identifyByEmail('test@email.com');
cdpPersonalize.identifyByProvider('customer_id', '1234567');

//Track Page Views
cdpPersonalize.trackPage();

//Create Events
cdpPersonalize.eventCreate({
  type: 'CUSTOM_EVENT', // "type" is required by CDP and Personalize
  extraData: 'example of extra information', // optionally, you can add any other properies you need
});
```

## Server Side (APIs)

Server side calls have been split into a different package, sitecore-cdp-personalize-api.

# Methods

- initialize
- trackPage
- identifyByEmail
- identifyByProvider
- eventCreate
- callFlows
- browserShow
- getBrowserId
- getGuestRef
- getBucketNumber
- getClientKey
- getCookie
- reset
- triggerExperiences

**initialize**

Used to configure what values CDP and Personalize is configured with. It also injects the Boxever (Sitecore CDP and Personalize) JavaScript Library into the head of the page. All other methods require that the initialize method is called at least once in the application.

```js
cdpPersonalize.initialize(
  '[CLIENT_KEY]',
  '[API_TARGET]',
  '[COOKIE_DOMAIN]',
  '[POINT_OF_SALE]',
  '[WEB_FLOW_TARGET]',
  '[LIBRARY_VERSION]', // optional, defaults to 1.4.9
  '[CURRENCY]', // optional, defaults to USD
  '[CHANNEL]', // optional, defaults to WEB
  '[LANGAUGE]' // optional, defaults to EN
);
```

**trackPage**

Used to track the user navigating pages. If your application is a SPA, make sure to call this method every time the user navigates within your application. You must call initialize before using trackPage().

```ts
cdpPersonalize.trackPage().then(response => console.log(response.status));
```

returns: a promise containing the HTTP status of the CDP and Perosnalize response.

**identifyByEmail**

Used to identify a user using their email as the ID. You must call initialize before using identifyByEmail().

```ts
cdpPersonalize.identifyByEmail(
  'example@email.com', // id: required
  {
    // optionally, send any additional properies you need
    customProperties: 'example value',
  }
);
```

returns: a promise containing the HTTP status of the CDP and Perosnalize response.

**identifyByProvider**

Used to identify a user using a custom identity provider and ID. You must call initialize before using identifyByProvider().

```ts
cdpPersonalize.identifyByProvider(
  'employee_id', // provider: required
  '716251', // id: required
  {
    // optionally, send any additional properies you need
    customProperties: 'example value',
  }
);
```

returns: a promise containing the HTTP status of the CDP and Perosnalize response.

**eventCreate**

Used to submit an event to CDP and Personalize. Internally, the library automatically adds the following properties for you:

- Page
- Currency
- POS
- browser_id
- channel
- language
- UTM parameters from URL

You must call initialize before using eventCreate().

```ts
cdpPersonalize
  .eventCreate({
    type: 'CUSTOM_EVENT', // "type" is required by CDP and Personalize
    extraData: 'example of extra information', // optionally, you can add any other properies you need
  })
  .then(response => console.log(response.status));
```

returns: a promise containing the HTTP status of the CDP and Perosnalize response.

**callFlows**

Used to execute a flow. Internally, the library automatically adds the following properties for you:

- Page
- Currency
- POS
- browser_id
- channel
- language
- clientKey

You must call initialize before using eventCreate().

```ts
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
```

returns: a promise containg the response from the flow, mapped to the type provided.

**browserShow**

Used to get the user's information. You must call initialize before using browserShow().

```ts
cdpPersonalize.browserShow().then(data => console.log(data.customer));
```

returns: a promise containing the customer object.

**getBrowserId**

Used to get the user's current browserId. You must call initialize before using getBrowserId().

```ts
cdpPersonalize.getBrowserId().then(browserId => console.log(browserId));
```

returns: a promise containing the user's current browserId.

**getGuestRef**

Used to get the user's current guest reference. You must call initialize before using getGuestRef().

```ts
cdpPersonalize.getGuestRef().then(ref => console.log(ref));
```

returns: a promise containing the user's guest reference.

**getBucketNumber**

Used to update the bucket number cookie to match the latest bucket number in Sitecore CDP. You should call this after an IDENTITY event.

```ts
cdpPersonalize.getBucketNumber().then(bucketNumber => {
  console.log(bucketNumber);
});
```

returns: a promise containing the user's updated bucket number.

**getClientKey**

Used to retrieve the client key. You must call initialize before using getClientKey().

```ts
cdpPersonalize.getClientKey().then(clientKey => {
  console.log(clientKey);
});
```

returns: a promise containing the client key.

**getCookie**

Used to retrieve cookie value. This only works for cookies set by Boxever (Sitecore CDP and Personalize) and cookies set by setCookie() (setCookie coming soon). You must call initialize before using getCookie().

```ts
cdpPersonalize.getCookie('bx_bucket_number').then(cookieValue => {
  console.log(cookieValue);
});
```

returns: a promise containing the cookie's value.

**reset**

Used to reinitialize the Boxever (Sitecore CDP and Personalize) JavaScript Library. It will clear the event queue, deletes the browser ID and guest reference, and reloads the javascript library.

```ts
cdpPersonalize.reset().then(() => {
  console.log('Values reset');
});
```

**triggerExperiences**

Used to rerun all the web experiences and experiments.

```ts
cdpPersonalize.triggerExperiences().then(() => {
  console.log('Experiences triggered');
});
```
