import React, { useState } from "react";
import Loader from "react-loader-spinner";
import axios from "axios";
import "./App.css";

const App = () => {
  const [gistData, setGistData] = useState([]);
  const [userName, setUserName] = useState("");
  const [h2, setH2] = useState("");
  const [showh2, setShowh2] = useState(false);
  const [showContent, setShowContent] = useState(false)
  const [content, setContent] = useState({})
  const [loader, showLoader] = useState(false)
  let forkIDS = []
  const URL = `https://api.github.com/users/${userName}/gists`;

  const getGistData = async () => {
    showLoader(true)
    if(userName.length === 0) {
      alert("Please enter a username")
      return
    }
    const response = await axios.get(URL);
    if(response.data.length === 0) {
      alert("No record found")
      return
    }
    setGistData(response.data);
    setH2(userName);
    setShowh2(true);
    getForkList(response.data)
    showLoader(false)
  };

  const getForkList = (data) => {

    data.map(item => forkIDS.push(item.id))
    forkIDS.map(ids => getForkDATA(ids))
      // forkUsers.push(response.owner.login)
    // console.log(forkUsers)
    // data.map(item => console.log(item.id))
    // console.log(ForkURL)
  };

  const getForkDATA = async (ids) => {
    const response = await axios.get(`https://api.github.com/gists/${ids}/forks`);
    console.log(response)

  }

  const updateUserName = (e) => {
    setUserName(e.target.value);
  };

  const displayContent = async (user) => {
    let arr = Object.entries(user["files"])
    let response = await axios.get(arr[0][1].raw_url)
    setContent({data: response.data, url : user["url"]})
    showContent ? setShowContent(false) : setShowContent(true)
}
  return (
    <>
    <div className="loader">
        <Loader
        type="Puff"
        color="black"
        height={100}
        width={100}
        visible = {loader}
      />
      </div>
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
      {showh2 ? <h2>Gists by {h2}</h2> : null}
      <div className="linkDisplay">
        {gistData.map((userGist) => (
          <>
            <br />
            <div className="record">
              <span className="link" onClick={()=>displayContent(userGist)}>{userGist["url"]}</span>
              <p>{Object.keys(userGist["files"])[0].split(".")[1] === "cs" ? 'C#' : Object.keys(userGist["files"])[0].split(".")[1]} </p>
            </div>
            {showContent && userGist["url"] === content.url ?
                <div className="content">
                  {content.data}
                </div> 
              : null}

            <br />
          </>
        ))}
      </div>
    </>
  );
};

export default App;
