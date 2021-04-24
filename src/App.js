import React, { useState } from "react";
import Loader from "react-loader-spinner";
import axios from "axios";
import "./App.css";

const App = () => {
  const [gistData, setGistData] = useState([]);
  const [userName, setUserName] = useState("");
  const [gistUserName, setGistUserName] = useState("");
  const [showGistUserName, setShowGistUserName] = useState(false);
  const [showContent, setShowContent] = useState(false)
  const [gistApiContent, setGistApiContent] = useState({})
  const [loader, showLoader] = useState(false)
  const [forkUsers, setForkUser] = useState({});

  let forkIDS = []

  
  const URL = `https://api.github.com/users/${userName}/gists`;

  const getGistData = async () => {
    showLoader(true)
    if(userName.length === 0) {
      alert("Please enter a username")
      showLoader(false)
      return
    }
    const response = await axios.get(URL);
    if(response.data.length === 0) {
      alert("No record found")
      showLoader(false)
      return
    }
    getForkList(response.data)
    setGistData(response.data);
    setGistUserName(userName);
    setShowGistUserName(true);
    setUserName("")
    showLoader(false)
  };
  const getForkList = (data) => {

    data.map(item => forkIDS.push(item.id))
    forkIDS.map(ids => getForkData(ids))
    // console.log(Object.keys(forkUsers).findIndex(key => key === "2a6851cde24cdaf4b85b")) //console kia hai
  };

  // pehle jaha state update kr rahey ho vo dikaho

  const getForkData = async (ids) => {
    let users = []
    const response = await axios.get(`https://api.github.com/gists/${ids}/forks`);
    if(response.data.length !== 0 ) {
      response.data.map(user => (
        users.push([user.owner.login])
      ))
      setForkUser(preForkUsers => {
        preForkUsers[ids] = users.slice(-3)
        return {...preForkUsers}; 
      })
    }
    // console.log(ids, forkUsers[ids])
  }

  const updateUserName = (e) => {
    setUserName(e.target.value);
  };

  const displayContent = async (user) => {
    let arr = Object.entries(user["files"])
    let response = await axios.get(arr[0][1].raw_url)
    setGistApiContent({data: response.data, url : user["url"]})
    showContent ? setShowContent(false) : setShowContent(true)
}
  const getLanguage = (user) => {
    let arr = Object.entries(user["files"])
    let response = arr[0][1].language
    return response
  }
  return (
    <>
    {loader ? (<div className="loader">
        <Loader
        type="Circles"
        color="black"
        height={100}
        width={100}
        visible = {loader}
      />
      <h2 style={{textDecoration: 'none'}}>Loading...</h2>
      </div>) : (
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
      <div>{showGistUserName ? <h2>Gists by {gistUserName}</h2> : null}</div>
      <div className="linkDisplay">
        {gistData.map((userGist) => (
          <>
            <br />
            <div key={userGist["id"]} className="record">
              <span onClick={()=>displayContent(userGist)}>{userGist["url"]}</span>
              <p className="lang">{getLanguage(userGist)}</p>
                {(userGist["id"]) in forkUsers ? 
                  <p className="users">{`${forkUsers[userGist["id"]][0]} ${forkUsers[userGist["id"]][1] !== undefined ? forkUsers[userGist["id"]][1] : ""} ${forkUsers[userGist["id"]][2] !== undefined ? forkUsers[userGist["id"]][2] : ""}`}</p> 
                : <p className = "users">N/A</p> }
            </div>
            {showContent && userGist["url"] === gistApiContent.url ?
                <div className="content">
                  {gistApiContent.data}
                </div> 
              : null}

            <br />
          </>
        ))}
      </div>
      </>)}
    </>
  );
};

export default App;
