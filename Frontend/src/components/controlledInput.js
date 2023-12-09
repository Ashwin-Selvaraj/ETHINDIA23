import React, { useState } from "react";
import axios from "axios";

const ControlledInput = () => {

  const [name, setName] = useState("");

  const handleInitialize = (e)=>
  {
    e.preventDefault();
    console.log(`Data captured in React: ${name}`);
    axios
      .post(`http://localhost:3001/api/initialize`,{ name: name })
      .then((response) => {
        console.log("Data sent to API:", response.data);
        setName("");
      })
      .catch((error) => {
        console.error("Error sending data to API:", error);
      });
  }

  return (
    <div className="controlled-input">
        <div className="form-control">
          <label htmlFor="name">Name :</label>
          <input
            type="text"
            id="name"
            name="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <button type="submit" onClick={handleInitialize}>
          Initialize
        </button>
      </div>
  );
};

export default ControlledInput;
