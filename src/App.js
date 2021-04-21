import React, { useState } from "react";
import axios from "axios";
import "./App.css";

const App = () => {
  const [gistData, setGistData] = useState([]);
  const [userName, setUserName] = useState("");
  const [h2, setH2] = useState("");
  const [showh2, setShowh2] = useState(false);
  const URL = `https://api.github.com/users/${userName}/gists`;

  const getGistData = async () => {
    const response = await axios.get(URL);
    setGistData(response.data);
    setH2(userName);
    setShowh2(true);
    gistData.map((userGist) => console.log(userGist["url"]));
  };

  const updateUserName = (e) => {
    setUserName(e.target.value);
  };

  return (
    <>
      <div className="container">
        <input
          className="input"
          type="text"
          placeholder="Search username"
          onChange={updateUserName}
        />
        <button className="btn" onClick={getGistData}>
          search
        </button>
      </div>
      {showh2 ? <h2>public gists by {h2}</h2> : null}
      <div className="linkDisplay">
        {gistData.map((userGist) => (
          <>
            <br />
            <a href={`userGist["url"]`}>{userGist["url"]}</a>
            <br />
          </>
        ))}
      </div>
    </>
  );
};

export default App;
