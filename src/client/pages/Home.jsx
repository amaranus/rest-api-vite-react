import { Button, Card, Footer, Label, Navbar, Pagination, TextInput } from 'flowbite-react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { HashLink } from 'react-router-hash-link'
import { useEffect, useState } from 'react'

function Home() {
  const [item, setItem] = useState(null)
  const [loading, setLoading] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [userId, setUserId] = useState(null)
  const [query, setQuery] = useState('')
  const [message, setMessage] = useState('')
  const navigate = useNavigate()
  const pageSize = 12

  const itemsFunction = async () => {
    try {
      setLoading(true)
      const response = await fetch(`http://localhost:3000/api/items`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      })
      if (!response.ok) {
        localStorage.removeItem('token')
        const data = await response.json()
        setMessage(data.message)
        navigate('/login')
      }
      const data = await response.json()
      setItem(data)
      setLoading(false)
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    const storedToken = localStorage.getItem('token')
    itemsFunction()
    if (storedToken) {
      verifyToken(storedToken)
        .then(setUserId)
        .catch(() => setIsLoggedIn(false))
      setIsLoggedIn(true)
    } else {
      setIsLoggedIn(false)
    }
  }, [])

  const verifyToken = async (token) => {
    const response = await fetch('http://localhost:3000/api/auth/verify', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    if (response.ok) {
      const data = await response.json()
      return data.user._id
    } else {
      throw new Error()
    }
  }

  const getCurrentPageItems = () => {
    if (!item) return []
    const startIndex = (currentPage - 1) * pageSize
    const endIndex = startIndex + pageSize
    return item.slice(startIndex, endIndex)
  }

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage)
  }

  const handleSearch = async (e) => {
    e.preventDefault()
    try {
      const response = await fetch(`http://localhost:3000/api/items/search?q=${query}`)
      const data = await response.json()

      setItem(data)
    } catch (error) {
      console.error('Arama sırasında bir hata oluştu:', error)
    }
  }

  return (
    <>
      <div className="dark container mx-auto">
        <Navbar fluid rounded>
          <Navbar.Brand as={Link} href="/">
            <img
              src="https://icongr.am/fontawesome/child.svg?size=48&color=ffffff"
              className="mr-3 h-6 sm:h-9"
              alt="Flowbite React Logo"
            />
            <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white">
              React API
            </span>
            <form className="ml-5" onSubmit={handleSearch}>
              <Label htmlFor="topbar-search" className="sr-only">
                Search
              </Label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <svg
                    className="h-4 w-4 text-gray-500 dark:text-gray-400"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 20 20">
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                    />
                  </svg>
                </div>
                <input
                  type="text"
                  name={query}
                  id="topbar-search"
                  className="focus:ring-primary-500 focus:border-primary-500 dark:focus:ring-primary-500 dark:focus:border-primary-500 block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 pl-9 text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 sm:text-sm"
                  placeholder="Search"
                  onChange={(e) => setQuery(e.target.value)}
                />
              </div>
            </form>
          </Navbar.Brand>
          <Navbar.Toggle />
          {isLoggedIn ? (
            <Navbar.Collapse>
              <HashLink className="text-white" to="/logout">
                Log out
              </HashLink>
              <HashLink className="text-white" to="/item">
                Add Item
              </HashLink>
              <HashLink className="text-white" to={'/profile/' + userId}>
                Profile
              </HashLink>
            </Navbar.Collapse>
          ) : (
            <Navbar.Collapse>
              <HashLink className="text-white" to="/login">
                Log in
              </HashLink>
              <HashLink className="text-white" to="/signin">
                Sign in
              </HashLink>
            </Navbar.Collapse>
          )}
        </Navbar>
        {loading ? (
          <div className="flex h-screen items-center justify-center">
            <div
              className="text-surface inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-e-transparent align-[-0.125em] text-white motion-reduce:animate-[spin_1.5s_linear_infinite]"
              role="status">
              <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
                Loading...
              </span>
            </div>
          </div>
        ) : null}
        <div className="mt-10 grid gap-2 lg:grid-cols-4">
          {getCurrentPageItems().map((dt, i) => (
            <Card
              key={i}
              className="mx-auto max-w-sm"
              imgAlt="Meaningful alt text for an image that is not purely decorative"
              imgSrc={dt.poster}>
              <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                {dt.name}
              </h5>
              <div className="rounded-lg bg-gray-100 p-4 dark:bg-gray-800 dark:text-gray-400">
                <p className="font-bold">Description</p>
                <p>{dt.description}</p>
              </div>
              <p className="font-normal text-gray-700 dark:text-gray-400">
                <Button color="dark" as={Link} to={`/detail/${dt._id}`}>
                  Detail
                </Button>
              </p>
            </Card>
          ))}
        </div>
        {/* Uyarı mesaj kutusu  */}
        {message && (
          <Toast className="flex max-w-full" onLoad={() => setMessage((state) => !state)}>
            <FaInfoCircle className="h-5 w-5 text-cyan-600 dark:text-cyan-500" />
            <div className="pl-4">{message}</div>
            <Toast.Toggle onDismiss={() => setMessage(false)} />
          </Toast>
        )}

        <div className="flex overflow-x-auto sm:justify-center">
          {item && (
            <Pagination
              className="mx-auto mb-3"
              currentPage={currentPage}
              totalPages={Math.ceil(item.length / pageSize)}
              onPageChange={handlePageChange}
            />
          )}
        </div>
        <Footer container>
          <Footer.Copyright href="#" by="React API" year={2024} />
          <Footer.LinkGroup>
            <Footer.Link href="#">About</Footer.Link>
            <Footer.Link href="#">Privacy Policy</Footer.Link>
            <Footer.Link href="#">Licensing</Footer.Link>
            <Footer.Link href="#">Contact</Footer.Link>
          </Footer.LinkGroup>
        </Footer>
      </div>
    </>
  )
}

export default Home
