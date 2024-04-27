import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
function Logout({ setIsLoggedIn }) {
  const navigate = useNavigate()

  const logoutFunc = async () => {
    try {
      const response = await fetch(`http://localhost:3000/api/auth/logout`, {
        method: 'POST',
      })

      const data = await response.json()
      if (!response.ok) {
        alert(data.message)
      }

      localStorage.removeItem('token')
      navigate('/login')
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    logoutFunc()
  }, [])

  return <></>
}

export default Logout
