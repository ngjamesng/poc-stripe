import React from "react";
import { useParams } from 'react-router-dom';

const MOCKDATA = {
  name: "BEST EVENT EVER",
  price: 1000
}

function EventPage() {
  const { id } = useParams();

  const handleSubmit = (evt)=>{
    evt.preventDefault();

  }
  return (
    <>
      <h1>pay for event. the id is {id}, the name is { MOCKDATA.name }!</h1>
      <p> the price is { MOCKDATA.price } pennies</p>
      <form onSubmit={handleSubmit}>
        <button>pay for event!</button>
      </form>
    </>
  )
}
export default EventPage;