import {
  FaQuestionCircle,
  FaLock,
  FaUser,
  FaUserSecret,
  FaHome,
  FaInfoCircle,
} from 'react-icons/fa'
import { Button, TextInput, Toast } from 'flowbite-react'
import { Link, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'

function Signin() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    rePassword: '',
    secretQuestion: '',
    secretAnswer: '',
  })
  const [errors, setErrors] = useState({})
  const [message, setMessage] = useState('')

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const newErrors = {}
    if (!formData.username) {
      newErrors.username = 'Username is required'
    }
    if (!formData.password) {
      newErrors.password = 'Password is required'
    }
    if (formData.password !== formData.rePassword) {
      newErrors.rePassword = 'Passwords do not match'
    }
    if (!formData.secretQuestion) {
      newErrors.secretQuestion = 'Secret Question is required'
    }
    if (!formData.secretAnswer) {
      newErrors.secretAnswer = 'Secret Answer is required'
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    try {
      const response = await fetch('http://localhost:3000/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (response.ok) {
        setMessage(data.message)

        navigate('/login')
        setFormData({
          username: '',
          password: '',
          rePassword: '',
          secretQuestion: '',
          secretAnswer: '',
        })
      } else {
        setMessage(data.message)
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
          navigate('/')
        } else {
          localStorage.removeItem('token')
        }
      })
    }
  }, [])

  return (
    <>
      <form
        className="dark mx-auto flex h-screen max-w-md flex-col justify-center gap-4"
        onSubmit={handleSubmit}>
        <p className="mb-3 text-4xl text-white">Sign in</p>
        <div>
          <TextInput
            id="username"
            name="username"
            type="text"
            placeholder="Username"
            icon={FaUser}
            value={formData.username}
            onChange={handleInputChange}
          />
          {errors.username && <p className="text-red-500">{errors.username}</p>}
        </div>
        <div>
          <TextInput
            id="password"
            name="password"
            type="password"
            placeholder="Password"
            icon={FaLock}
            value={formData.password}
            onChange={handleInputChange}
          />
          {errors.password && <p className="text-red-500">{errors.password}</p>}
        </div>
        <div>
          <TextInput
            id="re-password"
            name="rePassword"
            type="password"
            placeholder="Retype Password"
            icon={FaLock}
            value={formData.rePassword}
            onChange={handleInputChange}
          />
          {errors.rePassword && <p className="text-red-500">{errors.rePassword}</p>}
        </div>
        <div>
          <TextInput
            id="secret-question"
            name="secretQuestion"
            type="text"
            placeholder="Secret Question"
            icon={FaQuestionCircle}
            value={formData.secretQuestion}
            onChange={handleInputChange}
          />
          {errors.secretQuestion && <p className="text-red-500">{errors.secretQuestion}</p>}
        </div>
        <div>
          <TextInput
            id="secret-answer"
            name="secretAnswer"
            type="text"
            placeholder="Secret Answer"
            icon={FaUserSecret}
            value={formData.secretAnswer}
            onChange={handleInputChange}
          />
          {errors.secretAnswer && <p className="text-red-500">{errors.secretAnswer}</p>}
        </div>
        <Button type="submit">Submit</Button>
        <Button color="dark" as={Link} to={'/'}>
          <FaHome className="mr-2 h-5 w-5" />
          Home
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

export default Signin
