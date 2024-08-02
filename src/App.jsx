import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import Notification from './components/Notification'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')
  const [notification, setNotification] = useState(null)
  const [notificationType, setNotificationType] = useState('')

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs(blogs)
    )
  }, [])

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

      window.localStorage.setItem('loggedBlogappUser', JSON.stringify(user))
      setUser(user)
      setUsername('')
      setPassword('')
    } catch (exception) {
      setNotificationDisplay(`wrong username or password`, 'error')
    }
  }

  const handleLogout = async (event) => {
    window.localStorage.removeItem('loggedBlogappUser')
    setUser(null)
    setUsername('')
    setPassword('')
  }

  const handleCreateBlog = async (event) => {
    event.preventDefault()

    const newBlog = {
      title,
      author,
      url
    }

    try {
      const savedBlog = await blogService.create(newBlog)
      setBlogs(blogs.concat(savedBlog))
      setNotificationDisplay(`a new blog ${title} by ${author} added`, 'info')
      setTitle('')
      setAuthor('')
      setUrl('')
    } catch (exception) {
      setNotificationDisplay(exception, 'error')
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
    <div>
      <h2>create new</h2>
      <form onSubmit={handleCreateBlog}>
        <div>
          title:
          <input
            type="text"
            value={title}
            name="Title"
            onChange={({ target }) => setTitle(target.value)} />
        </div>
        <div>
          author:
          <input
            type="author"
            value={author}
            name="Author"
            onChange={({ target }) => setAuthor(target.value)} />
        </div>
        <div>
          url:
          <input
            type="url"
            value={url}
            name="Url"
            onChange={({ target }) => setUrl(target.value)} />
        </div>
        <button type="submit">create</button>
      </form>
    </div>
  )

  const blogsSection = () => (
    <>
      <h2>blogs</h2>
      <Notification message={notification} type={notificationType} />
      <p>{user.name} logged in <button onClick={handleLogout}>logout</button></p>
      {newBlogForm()}
      {
        blogs.map(blog =>
          <Blog key={blog.id} blog={blog} />
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