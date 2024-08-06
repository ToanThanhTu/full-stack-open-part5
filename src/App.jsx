import { useState, useEffect, useRef } from 'react'

// import components
import Blog from './components/Blog'
import Notification from './components/Notification'
import Togglable from './components/Togglable'
import BlogForm from './components/BlogForm'

// import services
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [notification, setNotification] = useState(null)
  const [notificationType, setNotificationType] = useState('')

  // get all blogs
  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs(blogs)
    )
  }, [])

  // Auto login user if present in local storage
  useEffect(() => {
    const loggedUser = window.localStorage.getItem('loggedBlogappUser')

    if (loggedUser) {
      const user = JSON.parse(loggedUser)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const user = await loginService.login({ username, password })
      window.localStorage.setItem('loggedBlogappUser', JSON.stringify(user)) // set user data in local storage
      setUser(user)
      setUsername('')
      setPassword('')
    } catch (exception) {
      setNotificationDisplay('wrong username or password', 'error')
    }
  }

  const handleLogout = async (event) => {
    window.localStorage.removeItem('loggedBlogappUser')
    setUser(null)
    setUsername('')
    setPassword('')
  }

  // use Ref hook to use toggleVisibility() from Togglable component
  const blogFormRef = useRef()

  const createBlog = async (newBlog) => {
    blogFormRef.current.toggleVisibility() // hide blog form after creation
    try {
      const savedBlog = await blogService.create(newBlog)
      setBlogs(blogs.concat(savedBlog))
      setNotificationDisplay(`a new blog ${savedBlog.title} by ${savedBlog.author} added`, 'info')
    } catch (exception) {
      setNotificationDisplay(exception.message, 'error')
    }
  }

  const updateBlog = async (blogObject) => {
    try {
      await blogService.update(blogObject)

      // update the blogs array with map and spread operator
      setBlogs(blogs.map(blog => blog.id === blogObject.id
        ? { ...blog, ...blogObject }
        : blog))
    } catch (exception) {
      setNotificationDisplay(exception.message, 'error')
    }
  }

  const deleteBlog = async (blogObject) => {
    try {
      await blogService.deleteBlog(blogObject.id)

      // remove the blog from blogs array with filter
      setBlogs(blogs.filter((blog) => blog.id !== blogObject.id))
      setNotificationDisplay(`blog ${blogObject.title} by ${blogObject.author} removed`, 'info')
    } catch (exception) {
      setNotificationDisplay(exception.message, 'error')
    }
  }

  const setNotificationDisplay = (message, type) => {
    setNotificationType(type)
    setNotification(message)
    setTimeout(() => {
      setNotification('')
      setNotificationType('')
    }, 5000)
  }

  const loginForm = () => (
    <>
      <h1>log in to application</h1>
      <Notification message={notification} type={notificationType} />
      <form onSubmit={handleLogin}>
        <div>
          username
          <input
            type="text"
            value={username}
            name='Username'
            onChange={({ target }) => setUsername(target.value)} />
        </div>
        <div >
          password
          <input
            type="password"
            value={password}
            name='Password'
            onChange={({ target }) => setPassword(target.value)} />
        </div>
        <button type='submit'>login</button>
      </form>
    </>
  )

  const newBlogForm = () => (
    <Togglable buttonLabel='create new blog' ref={blogFormRef}>
      <BlogForm createBlog={createBlog} />
    </Togglable>
  )

  const blogsSection = () => (
    <>
      <h2>blogs</h2>

      <Notification message={notification} type={notificationType} />
      <p>{user.name} logged in <button onClick={handleLogout}>logout</button></p>

      {newBlogForm()}

      {
        blogs
          .sort((a, b) => b.likes - a.likes)
          .map(blog =>
            <Blog
              key={blog.id}
              blog={blog}
              deleteBlog={deleteBlog}
              updateBlog={updateBlog}
              user={user}
            />
          )
      }
    </>
  )

  return (
    <div>
      {
        user === null
          ? loginForm()
          : blogsSection()
      }
    </div>
  )
}

export default App