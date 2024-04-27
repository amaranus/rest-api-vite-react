// Add a link to the homepage
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="bg-red-500 p-4 text-white">
      <h1 className="text-4xl">404 - Page Not Found</h1>
      <p>Sorry, the page you requested could not be found.</p>
      <Link to="/" className="text-blue-400 underline">
        Go to homepage
      </Link>
    </div>
  )
}

export default NotFound