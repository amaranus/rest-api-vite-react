import { Button, Checkbox, Label, TextInput, Toast } from 'flowbite-react'
import { FaHome, FaInfoCircle, FaLock, FaUser } from 'react-icons/fa'
import { Link, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'

function Login() {
  // const [rememberMe, setRememberMe] = useState(false)
  const navigate = useNavigate()
  const [message, setMessage] = useState('')
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  })
  const [errors, setErrors] = useState({})
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
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }
    try {
      const response = await fetch('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })
      const data = await response.json()
      if (!response.ok) {
        setMessage(data.message)
        return
      }
      const token = data.token
      const uName = data.username
      localStorage.setItem('token', token)
      // Oturumu hatırlamak istiyorsa, tarayıcıya token'i kaydet
      // if (rememberMe) {
      //   localStorage.setItem('token', token)
      // }
      navigate('/', { state: { isLoggedIn: true, uName: uName } })
    } catch (error) {
      console.error('Error:', error.message)
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
        <p className="mb-3 text-4xl text-white">Log in</p>
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
        {/* <div className="flex items-center gap-2">
          <Checkbox id="remember" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} />
          <Label htmlFor="remember">Remember me</Label>
        </div> */}
        <Button type="submit">Submit</Button>
        <Button color="dark" as={Link} to={'/'}>
          <FaHome className="mr-2 h-5 w-5" />
          Home
        </Button>
        <Link to={`/passwordreset`}>Forgot password?</Link>
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
export default Login
