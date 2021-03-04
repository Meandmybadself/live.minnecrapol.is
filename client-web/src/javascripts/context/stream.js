import React, { useState, useEffect, createContext, useContext } from 'react'
import axios from 'axios'

import { useAuth } from 'context/auth'

const StreamContext = createContext()

const makeGetStreamDataRequest = (token, renew = false) => {
  if (token) {
    return {
      url: `${API_HOST}/api/stream-data/me`,
      method: 'get',
      params: { renew },
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }
  }
 
    return {
      url: `${API_HOST}/api/stream-data`,
      method: 'get'
    }
  
}

const StreamProvider = ({ children }) => {
  const [ streaming, setStreaming ] = useState(null)
  const [ playStreamUrl, setPlayStreamUrl ] = useState(null)
  const [ publishStreamUrl, setPublishStreamUrl ] = useState(null)
  const [ publishStreamKey, setPublishStreamKey ] = useState(null)
  const [ expires, setExpires ] = useState(null)
  const [ streamingUser, setStreamingUser ] = useState(false)
  const [ loading, setLoading ] = useState(false)
  const [ polling, setPolling ] = useState(false)
  const { token } = useAuth()

  const getStreamData = async (background = false, renew = false) => {
    try {
      if (!background) setLoading(true)

      const streamDataResponse = await axios.request(makeGetStreamDataRequest(token, renew))

      setStreaming(streamDataResponse.data.streaming)
      setPlayStreamUrl(streamDataResponse.data.playStreamUrl)
      setPublishStreamUrl(streamDataResponse.data.publishStreamUrl)
      setPublishStreamKey(streamDataResponse.data.publishStreamKey)
      setExpires(streamDataResponse.data.expires)
      setStreamingUser(streamDataResponse.data.streamingUser)
    } catch (error) {
      console.error('Error getting streaming data', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    getStreamData(true)
    
    let handle
    if (polling) {
      handle = window.setInterval(() => {
        getStreamData(true)
      }, 5000)
    }

    return () => {
      window.clearInterval(handle)
    }
  }, [ polling, token ])

  useEffect(() => {
    if (streaming) {
      setPolling(false)
    } else {
      setPolling(true)
    }
  }, [ streaming ])

  useEffect(() => {
    getStreamData()
  }, [])

  const value = {
    streaming,
    playStreamUrl,
    publishStreamUrl,
    publishStreamKey,
    expires,
    loading,
    streamingUser,

    setPolling,
    getStreamData
  }

  return (
    <StreamContext.Provider value={ value }>
      { children }
    </StreamContext.Provider>
  )
}

const useStream = () => useContext(StreamContext)

export default StreamProvider
export { useStream }