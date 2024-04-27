// ReminderPasswordPage.js

import { FaLock, FaQuestionCircle, FaUser, FaUserSecret, FaInfoCircle } from 'react-icons/fa'
import { Button, Label, TextInput, Toast } from 'flowbite-react'
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const ReminderPasswordPage = () => {
  const [username, setUsername] = useState('')
  const [id, setId] = useState('')
  const [secretQuestion, setSecretQuestion] = useState('')
  const [secretAnswer, setSecretAnswer] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [showSecretQuestionInput, setShowSecretQuestionInput] = useState(false)
  const [showNewPasswordInput, setShowNewPasswordInput] = useState(false)
  const [message, setMessage] = useState('')


  const handleUsernameSubmit = async (e) => {
    e.preventDefault()

    try {
      const response = await fetch(`/api/auth/getsecretquestion?username=${username}`)
      const data = await response.json()

      if (response.ok && data.secretQuestion) {
        setSecretQuestion(data.secretQuestion)
        setId(data._id)
        setShowSecretQuestionInput(true)
        setMessage('')
      } else {
        setMessage(data.message)
      }
    } catch (error) {
      console.error(error)
      setMessage(error)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      const response = await fetch('/api/auth/pwdreset', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, secretAnswer }),
      })
      const data = await response.json()

      if (response.ok && data.user) {
        setShowNewPasswordInput(true)
        setMessage('')
      } else {
        // setMessage('Kullanıcı bulunamadı veya gizli soru/cevap eşleşmedi.')
        setMessage(data.message)
      }
    } catch (error) {
      console.error(error)
      // setMessage('Kullanıcı bulunamadı veya gizli soru/cevap eşleşmedi.')
      setMessage(error)
    }
  }

  const handlePasswordChange = async (e) => {
    e.preventDefault()

    try {
      const response = await fetch(`http://localhost:3000/api/users/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          password: newPassword,
          secretQuestion,
          secretAnswer,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setMessage(data.message)
        setShowNewPasswordInput(false)

      } else {
        setMessage(data.message)
      }
    } catch (error) {
      console.error(error)
      setMessage(error)
    }
  }

  return (
    <>
      <div className="dark mx-auto flex h-screen max-w-md flex-col justify-center gap-4">
        <p className="mb-3 text-4xl text-white">Forget Password</p>
        <form onSubmit={handleUsernameSubmit} className="flex max-w-md flex-col gap-4">
          <div>
            <div className="mb-2 block">
              <Label htmlFor="username" value="Your username" />
            </div>
            <TextInput
              id="username"
              name="username"
              type="text"
              icon={FaUser}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <Button type="submit">Secret Question</Button>
        </form>

        {showSecretQuestionInput && (
          <form onSubmit={handleSubmit} className="flex max-w-md flex-col gap-4">
            <div>
              <div className="mb-2 block">
                <Label htmlFor="secretQuestion" value="Your secret question" />
              </div>
              <TextInput
                id="secretQuestion"
                name="secretQuestion"
                type="text"
                icon={FaQuestionCircle}
                value={secretQuestion}
                disabled
              />
            </div>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="secretAnswer" value="Your secret answer" />
              </div>
              <TextInput
                id="secretAnswer"
                name="secretAnswer"
                type="text"
                icon={FaUserSecret}
                value={secretAnswer}
                onChange={(e) => setSecretAnswer(e.target.value)}
              />
            </div>

            <Button type="submit">Confirm</Button>
          </form>
        )}

        {showNewPasswordInput && (
          <form onSubmit={handlePasswordChange} className="flex max-w-md flex-col gap-4">
            <div>
              <div className="mb-2 block">
                <Label htmlFor="newPassword" value="New Password" />
              </div>
              <TextInput
                id="newPassword"
                name="newPassword"
                type="text"
                icon={FaLock}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>
            <Button type="submit">Change Password</Button>
          </form>
        )}
        {/* Uyarı mesaj kutusu  */}
        {message && (
          <Toast className="flex max-w-full" onLoad={() => setMessage((state) => !state)}>
            <FaInfoCircle className="h-5 w-5 text-cyan-600 dark:text-cyan-500" />
            <div className="pl-4">{message}</div>
            <Toast.Toggle onDismiss={() => setMessage(false)} />
          </Toast>
        )}
      </div>
    </>
  )
}

export default ReminderPasswordPage
