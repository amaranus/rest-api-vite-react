import { BrowserRouter as Router, Routes, Route, HashRouter } from 'react-router-dom'
import PasswordReminder from './pages/PasswordReminder'
import NotFound from './pages/NotFound'
import Profile from './pages/Profile'
import Signin from './pages/Signin'
import Detail from './pages/Detail'
import Logout from './pages/Logout'
import Login from './pages/Login'
import Home from './pages/Home'
import Item from './pages/Item'
import Test from './pages/Test'
import './App.css'
function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="login" element={<Login />} />
        <Route path="logout" element={<Logout />} />
        <Route path="signin" element={<Signin />} />
        <Route path="test" element={<Test />} />
        <Route path="item" element={<Item />} />
        <Route path="passwordreset" element={<PasswordReminder />} />
        <Route path="*" element={<NotFound />} />
        <Route path="profile/:id" element={<Profile />} />
        <Route path="detail/:id" element={<Detail />} />
      </Routes>
    </HashRouter>
  )
}
export default App
