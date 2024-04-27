import { Button, Textarea, TextInput, Toast } from 'flowbite-react'
import { FaAngleLeft, FaCouch, FaInfoCircle, FaTag } from 'react-icons/fa'
import { Link, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
function Item() {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState('')
  const navigate = useNavigate()
  const [formData, setFormData] = useState({ name: '', description: '', price: '' })
  const [errors, setErrors] = useState({})
  const [message, setMessage] = useState('')

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const newErrors = {}

    if (!formData.name) {
      newErrors.name = 'Name is required'
    }
    if (!formData.description) {
      newErrors.description = 'Description is required'
    }
    if (!formData.price) {
      newErrors.price = 'Price is required'
    }
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    try {
      const response = await fetch('http://localhost:3000/api/items', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(formData),
      })
      const data = await response.json()
      if (response.ok) {
        setMessage(data.message)
        navigate('/detail/' + data.newItem._id)
      } else {
        setMessage(data.message)
        return
      }
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    const storedToken = localStorage.getItem('token')
    if (storedToken) {
      fetch('http://localhost:3000/api/auth/verify', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${storedToken}`,
        },
      }).then((response) => {
        if (response.ok) {
          return
        } else {
          navigate('/login')
        }
      })
    } else {
      navigate('/login')
    }
  }, [])

  return (
    <>
      <form
        className="dark mx-auto flex h-screen max-w-md flex-col justify-center gap-4"
        onSubmit={handleSubmit}>
        <p className="mb-3 text-4xl text-white">Add Item</p>
        <div>
          <TextInput
            id="name"
            name="name"
            type="text"
            placeholder="Item name"
            icon={FaCouch}
            value={formData.name}
            onChange={handleInputChange}
          />
          {errors.name && <p className="text-red-500">{errors.name}</p>}
        </div>
        <div>
          <Textarea
            id="description"
            name="description"
            type="text"
            placeholder="Description"
            rows={10}
            value={formData.description}
            onChange={handleInputChange}
          />
          {errors.description && <p className="text-red-500">{errors.description}</p>}
        </div>
        <div>
          <TextInput
            id="price"
            name="price"
            type="text"
            placeholder="Price"
            icon={FaTag}
            value={formData.price}
            onChange={handleInputChange}
          />
          {errors.price && <p className="text-red-500">{errors.price}</p>}
        </div>
        <Button type="submit">Submit</Button>
        <Button color="dark" as={Link} onClick={() => navigate(-1)}>
          <FaAngleLeft className="mr-2 h-5 w-5" />
          Go back
        </Button>
        {/* Uyarı mesaj kutusu  */}
        {message && (
          <Toast className="flex max-w-full" onLoad={() => setMessage((state) => !state)}>
            <FaInfoCircle className="h-5 w-5 text-cyan-600 dark:text-cyan-500" />
            <div className="pl-4">{message}</div>
            <Toast.Toggle onDismiss={() => setMessage(false)} />
          </Toast>
        )}
      </form>
    </>
  )
}
export default Item
