import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

function test() {
  const [data, setData] = useState([])
  const navigate = useNavigate()
  const fetchItemData = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/items')
      if (!response) {
        console.error('No response from server')
        return
      }
      const dataItem = await response.json()
      if (!dataItem) {
        console.error('Empty response from server')
        return
      }
      setData(dataItem)
    } catch (error) {
      console.error('Error fetching item data:', error)
    }
  }

  useEffect(() => {
    fetchItemData()
  }, [])

  return (
    <div>
      {data.map((dt, index) => (
        <p style={{ cursor: 'pointer' }} key={index} onClick={() => navigate('/detail/' + dt._id)}>
          {dt.name}
        </p>
      ))}
    </div>
  )
}

export default test
