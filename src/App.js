import React, { useState, createRef, useEffect } from "react";
import { useScreenshot } from "use-react-screenshot";

import "./style.css";
import {
  ReplyIcon,
  RetweetIcon,
  LikeIcon,
  ShareIcon,
  VerifiedIcon,
} from "./icons";
import { AvatarLoader } from "./loaders";

import { language } from "./language";

const tweetFormat = (tweet) => {
  tweet = tweet
    .replace(/@([\w]+)/g, "<span>@$1</span>")
    .replace(/#([\wşçöğüıİ]+)/gi, "<span>#$1</span>")
    .replace(/(https?:\/\/[\w\.\/]+)/, "<span>$1</span>")
    .replace(/\n/g, "<br />");
  return tweet;
};

const formatNumber = (number) => {
  if (!number) {
    number = 0;
  }
  if (number < 1000) {
    return number;
  }
  number /= 1000;
  number = String(number).split(".");

  return (
    number[0] + (number[1] > 100 ? "," + number[1].slice(0, 1) + " B" : " B")
  );
};

export default function App() {
  const tweetRef = createRef(null);
  const downloadRef = createRef();
  const [name, setName] = useState();
  const [username, setUsername] = useState();
  const [isVerified, setIsVerified] = useState(0);
  const [tweet, setTweet] = useState();
  const [avatar, setAvatar] = useState();
  const [retweets, setRetweets] = useState(0);
  const [quoteTweets, setQuoteTweets] = useState(0);
  const [likes, setLikes] = useState(0);
  const [lang, setLang] = useState("tr");
  const [image, takeScreenshot] = useScreenshot();
  const [langText, setLangText] = useState();
  const getImage = () => takeScreenshot(tweetRef.current);

  useEffect(() => {
    setLangText(language[lang]);
  }, [lang]);

  useEffect(() => {
    if (image) {
      downloadRef.current.click();
    }
  }, [image]);

  const avatarHandle = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.addEventListener("load", function () {
      setAvatar(this.result);
    });
    reader.readAsDataURL(file);
  };

  return (
    <>
      <div className="tweet-settings">
        <h3>{langText?.settings}</h3>
        <ul>
          <li>
            <label>{langText?.name}</label>
            <input
              type="text"
              className="input"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </li>
          <li>
            <label>{langText?.username}</label>
            <input
              type="text"
              className="input"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </li>
          <li>
            <label>{langText?.tweet}</label>
            <textarea
              className="textarea"
              maxLength="290"
              value={tweet}
              onChange={(e) => setTweet(e.target.value)}
            />
          </li>
          <li>
            <label>{langText?.avatar}</label>
            <input type="file" className="input" onChange={avatarHandle} />
          </li>
          <li>
            <label>{langText?.retweet}</label>
            <input
              type="number"
              className="input"
              value={retweets}
              onChange={(e) => setRetweets(e.target.value)}
            />
          </li>
          <li>
            <label>{langText?.quoteTweets}</label>
            <input
              type="number"
              className="input"
              value={quoteTweets}
              onChange={(e) => setQuoteTweets(e.target.value)}
            />
          </li>
          <li>
            <label>{langText?.likes}</label>
            <input
              type="number"
              className="input"
              value={likes}
              onChange={(e) => setLikes(e.target.value)}
            />
          </li>
          <li>
            <label>{langText?.verifiedAccount}</label>
            <select
              onChange={(e) => setIsVerified(e.target.value)}
              defaultValue={isVerified}
            >
              <option value="1">{langText?.yes}</option>
              <option value="0">{langText?.no}</option>
            </select>
          </li>
          <button onClick={getImage}>{langText?.create}</button>
          <div className="download-url">
            {image && (
              <a ref={downloadRef} href={image} download="tweet.png">
                {langText?.download}
              </a>
            )}
          </div>
        </ul>
      </div>
      <div className="tweet-container">
        <div className="app-language">
          <span
            onClick={() => setLang("tr")}
            className={lang === "tr" && "active"}
          >
            Türkçe
          </span>
          <span
            onClick={() => setLang("en")}
            className={lang === "en" && "active"}
          >
            English
          </span>
        </div>

        <div className="tweet" ref={tweetRef}>
          <div className="tweet-author">
            {(avatar && <img src={avatar} alt="Profile" />) || <AvatarLoader />}
            <div>
              <div className="name">
                <span>{name || langText?.fullName}</span>
                {isVerified == 1 && <VerifiedIcon width="19" height="19" />}
              </div>
              <div className="username">@{username || langText?.username}</div>
            </div>
          </div>
          <div className="tweet-content">
            <p
              dangerouslySetInnerHTML={{
                __html: (tweet && tweetFormat(tweet)) || langText?.exampleTweet,
              }}
            />
          </div>
          <div className="tweet-stats">
            <span>
              <b>{formatNumber(retweets)}</b> {langText?.retweet}
            </span>
            <span>
              <b>{formatNumber(quoteTweets)}</b> {langText?.quoteTweets}
            </span>
            <span>
              <b>{formatNumber(likes)}</b> {langText?.likes}
            </span>
          </div>
          <div className="tweet-actions">
            <span>
              <ReplyIcon />
            </span>
            <span>
              <RetweetIcon />
            </span>
            <span>
              <LikeIcon />
            </span>
            <span>
              <ShareIcon />
            </span>
          </div>
        </div>
      </div>
    </>
  );
}
