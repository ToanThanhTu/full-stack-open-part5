import { useState } from 'react'
import PropTypes from 'prop-types'

const BlogForm = ({ createBlog }) => {
    const [title, setTitle] = useState('')
    const [author, setAuthor] = useState('')
    const [url, setUrl] = useState('')

    const addBlog = (event) => {
        event.preventDefault()

        createBlog({
            title,
            author,
            url
        })

        setTitle('')
        setAuthor('')
        setUrl('')
    }

    return (
        <div>
            <h2>create new</h2>
            <form onSubmit={addBlog}>
                <div>
                    title:
                    <input
                        type="text"
                        value={title}
                        name="Title"
                        onChange={({ target }) => setTitle(target.value)}
                        className='title-input'
                    />
                </div>
                <div>
                    author:
                    <input
                        type="author"
                        value={author}
                        name="Author"
                        onChange={({ target }) => setAuthor(target.value)}
                        className='author-input'
                    />
                </div>
                <div>
                    url:
                    <input
                        type="url"
                        value={url}
                        name="Url"
                        onChange={({ target }) => setUrl(target.value)}
                        className='url-input'
                    />
                </div>
                <button type="submit" className='create-button'>create</button>
            </form>
        </div>
    )
}


BlogForm.propTypes = {
    createBlog: PropTypes.func.isRequired
}

export default BlogForm