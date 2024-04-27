import { FaQuestionCircle, FaLock, FaUser, FaUserSecret, FaHome, FaInfoCircle } from 'react-icons/fa'
import { HiOutlineExclamationCircle } from 'react-icons/hi'
import { Button, Modal, TextInput, Toast } from 'flowbite-react'
import { Link, useParams } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'

function Profile() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [message, setMessage] = useState('')
  const [openModal, setOpenModal] = useState(false)

  const [userData, setUserData] = useState({
    username: '',
    password: '',
    secretQuestion: '',
    secretAnswer: '',
  })

  const [editMode, setEditMode] = useState(false)

  const fetchUserData = async () => {
    try {
      if (!localStorage.getItem('token')) {
        throw new Error('Token not found in local storage')
      }
      const response = await fetch(`http://localhost:3000/api/users/${id}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      })
      if (!response.ok) {
        throw new Error(`Failed to fetch user data. Response status: ${response.status}`)
      }
      const data = await response.json()
      if (!data) {
        throw new Error('Failed to fetch user data. Data is null')
      }
      setUserData({
        username: data.username,
        password: data.password,
        secretQuestion: data.secretQuestion,
        secretAnswer: data.secretAnswer,
      })
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    const verifyToken = async () => {
      try {
        if (localStorage.getItem('token') === null) {
          throw new Error('Local storage token is null')
        }
        const response = await fetch('http://localhost:3000/api/auth/verify', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        })
        if (!response.ok) {
          throw new Error(`Failed to verify token. Response status: ${response.status}`)
        }
        fetchUserData()
      } catch (error) {
        console.error(error)
        navigate('/login')
      }
    }

    verifyToken()
  }, [])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setUserData({ ...userData, [name]: value })
  }

  const handleEditClick = () => {
    setEditMode(true)
    userData.password = ''
  }

  const handleCancelEdit = () => {
    setEditMode(false)
    fetchUserData()
  }

  const handleSaveChanges = async () => {
    try {
      const response = await fetch(`http://localhost:3000/api/users/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      })

      const data = await response.json()

      if (response.ok) {
        setMessage(data.message)
        setEditMode(false)
      } else {
        setMessage(data.message)
      }
    } catch (error) {
      console.error(error)
    }
  }

  const handleDeleteAccount = async () => {
    try {
      const response = await fetch(`http://localhost:3000/api/users/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      })

      const data = await response.json()

      if (response.ok) {
        setMessage(data.message)
        navigate('/')
      } else {
        throw new Error('Failed to delete account')
      }
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <div className="dark mx-auto flex h-screen max-w-md flex-col justify-center gap-4">
      <p className="mb-3 text-4xl text-white">User Profile</p>
      <div>
        <TextInput
          id="username"
          name="username"
          type="text"
          placeholder="Username"
          icon={FaUser}
          value={userData.username}
          onChange={handleInputChange}
          disabled={!editMode}
          required
        />
      </div>
      <div>
        <TextInput
          id="secret-question"
          name="secretQuestion"
          type="text"
          placeholder="Secret Question"
          icon={FaQuestionCircle}
          value={userData.secretQuestion}
          onChange={handleInputChange}
          disabled={!editMode}
          required
        />
      </div>
      <div>
        <TextInput
          id="secret-answer"
          name="secretAnswer"
          type="text"
          placeholder="Secret Answer"
          icon={FaUserSecret}
          value={userData.secretAnswer}
          onChange={handleInputChange}
          disabled={!editMode}
          required
        />
      </div>
      <div>
        <TextInput
          id="password"
          name="password"
          type="password"
          placeholder="Password"
          icon={FaLock}
          value={userData?.password}
          onChange={handleInputChange}
          disabled={!editMode}
          required
        />
      </div>

      {editMode ? (
        <>
          <Button onClick={handleSaveChanges}>Save</Button>
          <Button onClick={handleCancelEdit} color="dark">
            Cancel
          </Button>
        </>
      ) : (
        <Button onClick={handleEditClick}>Edit</Button>
      )}
      <Button color="dark" as={Link} to="/">
        <FaHome className="mr-2 h-5 w-5" />
        Home
      </Button>

      <Link onClick={() => setOpenModal(true)} className="mx-auto text-red-500">
        Delete Account
      </Link>
      <Modal show={openModal} size="md" onClose={() => setOpenModal(false)} popup>
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200" />
            <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
              Are you sure you want to delete your account?
            </h3>
            <div className="flex justify-center gap-4">
              <Button color="failure" onClick={handleDeleteAccount}>
                {"Yes, I'm sure"}
              </Button>
              <Button color="gray" onClick={() => setOpenModal(false)}>
                No, cancel
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
      {message && (
          <Toast className="flex max-w-full" onLoad={() => setMessage((state) => !state)}>
            <FaInfoCircle className="h-5 w-5 text-cyan-600 dark:text-cyan-500" />
            <div className="pl-4">{message}</div>
            <Toast.Toggle onDismiss={() => setMessage(false)} />
          </Toast>
        )}

    </div>
  )
}

export default Profile
