import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import axios from "axios";


function CreatorSignUp() {
  const history = useHistory();
  const [formData, setFormData] = useState({});
  const [stripeURL, setStripeURL] = useState("");
  const handleChange = evt => {
    const { name, value } = evt.target;
    setFormData(fData => ({
      ...fData,
      [name]: value
    }));
  }

  const handleSubmit = async (evt) => {
    evt.preventDefault();
    let response =
      await axios.get("http://localhost:3001/register_as_a_creator",
        { params: formData }
      );
    setStripeURL(response.data);
  }
  return (
    <>
      <h1>Sign up to be a content creator!</h1>
      <form onSubmit={handleSubmit}>
        <p>confirm your details....</p>
        <div>
          <label htmlFor="firstName">first name</label>
          <input name="firstName" id="firstName" type="text"
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="lastName">last name</label>
          <input name="lastName" id="lastName" type="text"
            onChange={handleChange} />
        </div>
        <div>
          <label htmlFor="email">email</label>
          <input name="email" id="email" type="text"
            onChange={handleChange}
          />
        </div>
        <button>get URL!</button>
      </form>
      {stripeURL && <a href={stripeURL}>Continue</a>}
    </>
  )
}

export default CreatorSignUp;