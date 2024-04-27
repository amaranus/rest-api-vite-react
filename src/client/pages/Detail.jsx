import { Badge, Button, Card, Label, Textarea, TextInput, Toast, Modal } from 'flowbite-react'
import { HiOutlineExclamationCircle } from 'react-icons/hi'
import { FaAngleLeft, FaInfoCircle } from 'react-icons/fa'
import { Link, useParams } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import Loading from './components/loading'

function Detail() {
  const { id } = useParams()
  const [item, setItem] = useState(null)
  const [loading, setLoading] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [editedItem, setEditedItem] = useState(null)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [message, setMessage] = useState('')
  const [openModal, setOpenModal] = useState(false)
  const navigate = useNavigate()

  const fetchItem = async () => {
    setLoading(true)
    try {
      const response = await fetch(`http://localhost:3000/api/items/${id}`)
      if (response.ok) {
        const data = await response.json()
        setItem(data)
      } else {
        throw new Error('Item not found')
      }
    } catch (error) {
      console.log('Error fetching item:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const storedToken = localStorage.getItem('token')
    fetchItem()
    if (storedToken) {
      fetch('http://localhost:3000/api/auth/verify', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${storedToken}`,
        },
      })
        .then((response) => {
          if (response.ok) {
            setIsLoggedIn(true)
          } else {
            setIsLoggedIn(false)
          }
        })
        .catch((error) => {
          console.error(error)
          setIsLoggedIn(false)
        })
      setIsLoggedIn(true)
    } else {
      setIsLoggedIn(false)
    }
  }, [])

  const handleEditClick = () => {
    setIsEditing(true)
    setEditedItem({ name: item.name, description: item.description, price: item.price })
  }
  const handleCancelEdit = () => {
    setIsEditing(false)
    setEditedItem(null)
  }
  const handleSaveEdit = async () => {
    if (!id) {
      console.error('id is null or undefined')
      return
    }
    if (!localStorage.getItem('token')) {
      console.error('localStorage token is null or undefined')
      return
    }
    if (!editedItem) {
      console.error('editedItem is null or undefined')
      return
    }
    try {
      const response = await fetch(`http://localhost:3000/api/items/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(editedItem),
      })
      const data = await response.json()
      if (response.ok) {
        setMessage(data.message)
      } else {
        throw new Error('Error updating item')
      }
      setIsEditing(false)
      fetchItem()
    } catch (error) {
      console.error(error)
    }
  }

  const handleDelete = async () => {
    setLoading(true)
    try {
      const response = await fetch(`http://localhost:3000/api/items/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      })
      if (response.ok) {
        navigate('/')
      } else {
        throw new Error(`Failed to delete item. Status: ${response.status}`)
      }
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }
  const handleInputChange = (e) => {
    const { name, value } = e.target
    setEditedItem({ ...editedItem, [name]: value })
  }

  return (
    <>
      <Loading loading={loading}></Loading>
      <div className="dark flex min-h-screen items-center justify-center">
        <Card
          className="max-w-sm"
          imgAlt="Meaningful alt text for an image that is not purely decorative"
          imgSrc="">
          {!isEditing ? (
            <>
              <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                {item?.name}
              </h5>
              <div className="rounded-lg bg-gray-100 p-4 dark:bg-gray-800 dark:text-gray-400">
                <p className="font-bold">Description</p>
                <p>{item?.description}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <Badge color="dark" size="lg">
                    Price: $ {item?.price}
                  </Badge>
                  <Badge color="success" size="lg">
                    Fresh
                  </Badge>
                </div>
              </div>
              {isLoggedIn ? (
                <>
                  <Button color="dark" onClick={handleEditClick}>
                    Edit
                  </Button>
                  <Button color="failure" onClick={() => setOpenModal(true)}>
                    Delete
                  </Button>
                </>
              ) : null}
              {/* Uyarı mesaj kutusu  */}
              {message && (
                <Toast className="flex max-w-full" onLoad={() => setMessage((state) => !state)}>
                  <FaInfoCircle className="h-5 w-5 text-cyan-600 dark:text-cyan-500" />
                  <div className="pl-4">{message}</div>
                  <Toast.Toggle onDismiss={() => setMessage(false)} />
                </Toast>
              )}
            </>
          ) : (
            <div className="mt-3 flex flex-wrap  gap-2">
              <p className="mb-3 text-4xl text-white">Edit Item</p>
              <Label className="w-full" htmlFor="name">
                Item name
              </Label>
              <TextInput
                type="text"
                name="name"
                value={editedItem?.name}
                onChange={handleInputChange}
                className="size-full"
              />
              <Label className="w-full" htmlFor="description">
                Description
              </Label>
              <Textarea
                name="description"
                value={editedItem?.description}
                onChange={handleInputChange}
                rows={10}
              />
              <Label className="w-full" htmlFor="price">
                Price
              </Label>
              <TextInput
                type="text"
                name="price"
                value={editedItem?.price}
                onChange={handleInputChange}
                className="size-full"
              />
              <div className="flex gap-2">
                <Button color="success" onClick={handleSaveEdit} className={'w-full'}>
                  Save
                </Button>
                <Button onClick={handleCancelEdit}>Cancel</Button>
              </div>
            </div>
          )}
          <Button color="dark" as={Link} onClick={() => navigate(-1)}>
            <FaAngleLeft className="mr-2 h-5 w-5" />
            Go back
          </Button>
        </Card>
        <Modal show={openModal} size="md" onClose={() => setOpenModal(false)} popup>
          <Modal.Header />
          <Modal.Body>
            <div className="text-center">
              <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200" />
              <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
                Are you sure you want to delete this product?
              </h3>
              <div className="flex justify-center gap-4">
                <Button color="failure" onClick={handleDelete}>
                  {"Yes, I'm sure"}
                </Button>
                <Button color="gray" onClick={() => setOpenModal(false)}>
                  No, cancel
                </Button>
              </div>
            </div>
          </Modal.Body>
        </Modal>
      </div>
    </>
  )
}
export default Detail
