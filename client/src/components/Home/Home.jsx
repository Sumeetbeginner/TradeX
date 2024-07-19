
import React, {useLayoutEffect} from 'react'
import { useNavigate } from 'react-router-dom'

const Home = () => {

  const location = useNavigate()

  useLayoutEffect(() => {
    if(!localStorage.getItem('userAuth')){
      location('/welcome')
    }
  }, [])

  return (
    <div>Home</div>
  )
}

export default Home