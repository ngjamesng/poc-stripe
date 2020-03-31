import React, { useState, useEffect } from "react";
import { useParams } from 'react-router-dom';
import axios from "axios";
import {loadStripe} from '@stripe/stripe-js';
const stripePK = "";

const MOCKDATA = {
  name: "BEST EVENT EVER",
  price: 1000
}

function EventPage() {
  const { id } = useParams();
  const [evenData, setEventData] = useState({});
  const [paymentLink, setPaymentLink] = useState("");
  useEffect(() => {
    // let response = axios.get(`http://localhost:3001/events/${id}`);

  })

  const handleSubmit = async (evt) => {
    evt.preventDefault();
    console.log("submitted");
    let sessionId =
      await axios.post(`http://localhost:3001/events/${id}`,
        {
          id: id,
          price: MOCKDATA.price
        });
    console.log(sessionId.data);
    const stripe = await loadStripe(stripePK);
    const {error} = stripe.redirectToCheckout({
      sessionId: sessionId.data
    })
  }
  return (
    <>
      <h1>pay for event. the id is {id}, the name is {MOCKDATA.name}!</h1>
      <p> the price is {MOCKDATA.price} pennies</p>
      <form onSubmit={handleSubmit}>
        <button>pay for event!</button>
      </form>
      {paymentLink && <a href={paymentLink}>Payment Link</a>}
    </>
  )
}
export default EventPage;