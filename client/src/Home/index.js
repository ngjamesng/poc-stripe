import React from 'react';
import { Link } from "react-router-dom";
function Home() {
  return (
    <>
      <h1>HOME</h1>
      <Link to="/register"> register as a creator</Link>
      <br></br>
      <Link to="/events/1"> go purcahse an event</Link>
    </>
  )
}
export default Home;