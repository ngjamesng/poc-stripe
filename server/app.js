require("dotenv").config();
const stripe_client_id = process.env.stripe_client_id;
const stripe_sk = process.env.stripe_sk;
const connected_stripe_id = process.env.connected_stripe_id;
const stripe = require('stripe')(stripe_sk);


const express = require("express");
const session = require("express-session");
const axios = require("axios");
const nunjucks = require("nunjucks");

const querystring = require("querystring");
const MOCK_SESSION_STATE = "_SECRET_RANDOM_";
const AUTHORIZE_URI = 'https://connect.stripe.com/express/oauth/authorize';

const app = express();

app.use(express.json());

nunjucks.configure("templates", {
  autoescape: true,
  express: app
});


/**
 * ROUTES START HERE
 */
/** show the form to fill out when you want to become a creator*/
app.get("/", (req, res) => {
  return res.render("sign-up-form.html");
});


/** handle posting of registering as a creator */
app.get("/register_as_a_creator", (req, res) => {

  req.session = {}; //mocking a session
  req.session.state = MOCK_SESSION_STATE;
  const { firstName, lastName, email } = req.query;
  let parameters = {
    client_id: stripe_client_id,
    state: req.session.state,
    'stripe_user[first_name]': firstName || undefined,
    'stripe_user[last_name]': lastName || undefined,
    'stripe_user[email]': email || undefined,
    // 'stripe_user[business_type]': req.user.type || 'individual',
    // 'stripe_user[business_name]': req.user.businessName || undefined,
    // 'stripe_user[country]': req.user.country || undefined
  }
  res.redirect(AUTHORIZE_URI + "?" + querystring.stringify(parameters));
})


/** after a creator finishes with stripe and gets a
 *  redirect, validate the req.query.state, and save the code to the database
 * */
app.get("/connect/oauth", (req, res) => {
  req.session = {};
  req.session.state = MOCK_SESSION_STATE; //simulating session data
  const { code, state } = req.query;
  // check if the state matches what we sent. it must be unique
  // if not valid, return error
  if (state !== MOCK_SESSION_STATE) {
    return res.status(403).json({ error: 'Incorrect state parameter: ' + state });
  }
  let error;

  stripe.oauth.token({
    grant_type: 'authorization_code',
    code: code,
  }).then(
    (response) => {
      let connected_account_id = response.stripe_user_id;
      //WE NEED TO STORE THE sripe_user_id IN OUR DATABASE!!!!!
      console.log("CONNECTED_ACCOUNT_ID", connected_account_id);
      // Render some HTML or redirect to a different page.
      // return res.status(200).json({ success: true });
      //redirect to a page? sign up for an event. 
      res.redirect("/events/1");

    },
    (err) => {
      if (err.type === 'StripeInvalidGrantError') {
        return res.status(400).json({ error: 'Invalid authorization code: ' + code });
      } else {
        return res.status(500).json({ error: 'An unknown error occurred.' });
      }
    }
  );

});

/** shows a single event */
app.get("/events/:id", (req, res) => {
  const eventId = req.params.id;
  //MOCKING DATA FROM DB
  const eventData = {
    id: eventId,
    price: 1000, // $10.00, price should be in pennies/integers, no floats. If not, convert it!
    name: "BEST EVENT EVER"
  }
  return res.render("eventPaymentPage.html", eventData);
});

app.post("/events/:id", async (req, res) => {
  const eventId = req.params.id;
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [{
      name: "TEST PAYMENT",
      amount: 1000,
      currency: 'usd',
      quantity: 1,
    }],
    payment_intent_data: {
      application_fee_amount: 123,
      transfer_data: {
        destination: connected_stripe_id, //this id is based on each customer. 
      },
    },
    success_url: `http://localhost:3000/events/${eventId}`,
    cancel_url: 'http://localhost:3000/cancelledPayment',
  });

  console.log("session.id>>>>", session.id);
  stripe.redirectToCheckout({
    // Make the id field from the Checkout Session creation API response
    // available to this file, so you can provide it as parameter here
    // instead of the {{CHECKOUT_SESSION_ID}} placeholder.
    sessionId: session.id
  }).then(function (result) {
    // If `redirectToCheckout` fails due to a browser or network
    // error, display the localized error message to your customer
    // using `result.error.message`.
  });
})

app.get("/cancelledPayment", (req, res) => {
  return res.render("cancelledPayment.html");
})

/** general error handler */
app.use((err, req, res, next) => {
  res.status(err.status || 500);

  return res.render("error.html", { err });
});

app.listen(3000, function () {
  console.log("app listening on port 3000");
});