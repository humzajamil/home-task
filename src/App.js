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
  const [avatars, setAvatars] = useState({});

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
    setGistData(response.data);
    setGistUserName(userName);
    setShowGistUserName(true);
    getForkList(response.data)
    showLoader(false)
  };
// useEffect(() => {
//   // console.log(Object.keys(avatars).findIndex(key => key === "2a6851cde24cdaf4b85b")) //console kia hai
//   console.log(Object.keys(avatars));
// },)
  const getForkList = (data) => {

    data.map(item => forkIDS.push(item.id))
    forkIDS.map(ids => getForkData(ids))
    // console.log(Object.keys(avatars).findIndex(key => key === "2a6851cde24cdaf4b85b")) //console kia hai
  };

  const getForkData = async (ids) => {
    let users = []

    const response = await axios.get(`https://api.github.com/gists/${ids}/forks`);
    if(response.data.length !== 0 ) {
      response.data.map(user => (
        users.push([user.owner.login])
      ))
      setAvatars(oldAvatars => {
        oldAvatars[ids] = users.slice(-3)
        return oldAvatars;
      })
    }
    console.log(ids, avatars[ids])
    
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
            <div className="record">
              <span className="link" onClick={()=>displayContent(userGist)}>{userGist["url"]}</span>
              <p>{Object.keys(userGist["files"])[0].split(".")[1] === "cs" ? 'C#' : Object.keys(userGist["files"])[0].split(".")[1]} </p>
              {(userGist["id"]) in avatars ? 
                <p>{`${avatars[userGist["id"]][0]}, ${avatars[userGist["id"]][1]},${avatars[userGist["id"]][2]}`}</p> 
              : null }
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
