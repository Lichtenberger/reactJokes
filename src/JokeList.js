import React, { useState, useEffect } from "react";
import axios from "axios";
import Joke from "./Joke";
import "./JokeList.css";

/** List of jokes. */

function JokeList({numJokesToGet = 5}) {
  const [jokes, setJokes] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(function() {
    async function getJokes() {
      let joke = [...jokes]
      let seenJokes = new Set()
      try {
        while(joke.length < numJokesToGet) {
          let res = await axios.get('https://icanhazdadjoke.com', {
            headers: {Accept: 'application/json'}
          })
          let {...jokeObj} = res.data

          if(!seenJokes.has(jokeObj.id)) {
            seenJokes.add(jokeObj.id)
            joke.push({...jokeObj, votes: 0})
          } else {
            console.error('duplicate joke')
          }
        }
        setJokes(joke)
        setIsLoading(false)
      } catch (err) {
        console.error(err)
      }
    }

    if(jokes.length === 0) getJokes()
  }, [jokes, numJokesToGet])

  function generateNewJokes() {
    setJokes([])
    setIsLoading(true)
  }

  function vote(id, delta) {
    setJokes(allJokes => 
      allJokes.map(joke => (joke.id === id ? {...joke, votes: joke.votes + delta} : joke))
    )
  }

  if(isLoading) {
    return (
      <div className="loading">
        <i className="fas fa-4x fa-spinner fa-spin" />
      </div>
    )
  }

  let sortedJokes = [...jokes].sort((a,b) => b.votes - a.votes)

  return (
      <div className="JokeList">
        <button className="JokeList-getmore" onClick= {generateNewJokes}>Get New Jokes</button>

        {sortedJokes.map(({joke, id, votes}) => (
        <Joke text={joke} key={id} id={id} votes={votes} vote={vote} />
       ))}
      </div>
    )
  }

export default JokeList;
