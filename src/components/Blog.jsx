import { useState } from 'react'
import PropTypes from 'prop-types'

const Blog = ({ blog, deleteBlog, updateBlog, user }) => {
  const [visible, setVisible] = useState(false)

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  // show/hide display styles
  const showWhenVisible = {
    display: visible ? '' : 'none'
  }

  const hideWhenVisible = {
    display: visible ? 'none' : ''
  }

  const toggleVisibility = () => {
    setVisible(!visible)
  }

  const addLike = () => {
    blog.likes = blog.likes + 1
    updateBlog(blog)
  }

  const removeBlog = () => {
    window.confirm(`Remove blog ${blog.title} by ${blog.author}?`)
    deleteBlog(blog)
  }

  return (
    <div style={blogStyle} className='blog' data-testid={blog.title}>
      {blog.title} - {blog.author}
      <button
        onClick={toggleVisibility}
        style={hideWhenVisible}
        className='view-button'
      >
        view
      </button>
      <button
        onClick={toggleVisibility}
        style={showWhenVisible}
      >
        hide
      </button>
      <div style={showWhenVisible} className='blog-info'>
        <div>{blog.url}</div>
        <div>
          likes <span className='likes'>{blog.likes}</span>
          <button onClick={addLike} className='like-button'>like</button>
        </div>
        <div>{blog.user ? blog.user.name : ''}</div>
        { /* show 'remove' button only when username matches  */
          blog.user
            ? blog.user.username === user.username
              ? <button onClick={removeBlog}>remove</button>
              : null
            : null
        }

      </div>
    </div>
  )
}

Blog.propTypes = {
  blog: PropTypes.object.isRequired,
  deleteBlog: PropTypes.func.isRequired,
  updateBlog: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired
}

export default Blog