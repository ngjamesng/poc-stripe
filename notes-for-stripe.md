### 1. Connect our creators by redirecting to Stripe through stripe's website, then redirect back to us. 

* First, Our creators will need to get connected with Stripe. 
* Stripe handles the payment processing, and LiveStack will need to redirect the user to Stripe to get started. 
**WE MUST SET UP OUR REDIRECT BACK TO OUR WEBSITE OR ELSE OUR CONTENT-CREATORS WILL GET AN ERROR**

```https://connect.stripe.com/express/oauth/authorize
?client_id={OURCLIENTID}
&state={STATE_VALUE}
&suggested_capabilities[]=transfers
&stripe_user[email]=user@example.com
```

  `client_id`: LiveStack's client_id(NOT the content creators) will need to be used to collect payments.

  `state`: a unique string used to prevent CSRF attacks. Will need to be generated from our server, which is sent along to stripe. The value is then passed back in their redirect after they finish onboarding. 

  `suggested_capabilities`: What the connected account is allowed to do. 

  `stripe_user`: used to prefill any info to fill out with stripe. We should at least prefill email and name. 

Once a user is connected with stripe, they will be redirected back to our site with the `state` we sent them. Again, we must set up the redirect URL on the stripe platform settings. 

### 2. The user is redirected back to us, and we get an authorization code, and state back. This will be in the req.query.

```js
  app.get("/connect/oauth", async (req, res)=>{
    const { code, state } = req.query;
    //other code 
  })
  ```
* first, we must validate the state on our server. This is similar to a token. If not valid, we should send an error to our user. This is used to prevent CSRF attacks. 

* once we validate the state, we use stripe's API and send the authorization code. 

* when we get a response from the stripe authorization code, we receive a stripe user ID in `response.stripe_user_id`, **WE NEED TO STORE THIS IN OUR DATABASE. THIS WILL BE NEEDED IN ORDER TO TRANSER FUNDS**

* Finally, we can show a success or redirect our content-creator appropriately. 

``` js
  // Send the authorization code to Stripe's API.
  stripe.oauth.token({
    grant_type: 'authorization_code',
    code
  }).then(
    (response) => {
      let connected_account_id = response.stripe_user_id;
      //WE NEED TO STORE THE sripe_user_id IN OUR DATABASE!!!!!
      saveAccountId(connected_account_id);
      // Render some HTML or redirect to a different page.
      return res.status(200).json({success: true});
    },
    (err) => {
      if (err.type === 'StripeInvalidGrantError') {
        return res.status(400).json({error: 'Invalid authorization code: ' + code});
      } else {
        return res.status(500).json({error: 'An unknown error occurred.'});
      }
    }
  );
```