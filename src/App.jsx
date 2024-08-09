import { useState, useEffect, useRef } from 'react'

// import components
import Blog from './components/Blog'
import Notification from './components/Notification'
import Togglable from './components/Togglable'
import BlogForm from './components/BlogForm'
import LoginForm from './components/LoginForm'

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

  // Login handler
  const login = async (event) => {
    event.preventDefault()

    try {
      const user = await loginService.login({ username, password })
      window.localStorage.setItem('loggedBlogappUser', JSON.stringify(user)) // set user data in local storage

      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch (exception) {
      setNotificationDisplay('wrong username or password', 'error')
    }
  }

  // Logout handler
  const logout = async (event) => {
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

  // Blog update handler
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

  // Blog deletion handler
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

  // Setting Notification text and type for CSS
  const setNotificationDisplay = (message, type) => {
    setNotificationType(type)
    setNotification(message)
    setTimeout(() => {
      setNotification('')
      setNotificationType('')
    }, 5000)
  }

  // Helper function for Login Form
  const loginForm = () => (
    <LoginForm
      username={username}
      password={password}
      handleLogin={login}
      handleUsernameChange={({ target }) => setUsername(target.value)}
      handlePasswordChange={({ target }) => setPassword(target.value)}
    >
      <Notification message={notification} type={notificationType} />
    </LoginForm>
  )

  // Helper function for Create New Blog Form
  const newBlogForm = () => (
    <Togglable buttonLabel='create new blog' ref={blogFormRef}>
      <BlogForm createBlog={createBlog} />
    </Togglable>
  )

  // Helper function for displaying blogs
  const blogsSection = () => (
    <>
      <h2>blogs</h2>

      <Notification message={notification} type={notificationType} />
      <p>{user.name} logged in <button onClick={logout}>logout</button></p>

      {newBlogForm()}

      {
        blogs
          .sort((a, b) => b.likes - a.likes) // Sort blogs based on Likes
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