import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import BlogForm from './BlogForm'

test('<BlogForm /> calls event handler to create new blog with right details', async () => {
    const createBlog = vi.fn()
    const user = userEvent.setup()

    const blogFormContainer = render(<BlogForm createBlog={createBlog} />).container

    const titleInput = blogFormContainer.querySelector('.title-input')
    const authorInput = blogFormContainer.querySelector('.author-input')
    const urlInput = blogFormContainer.querySelector('.url-input')
    const createButton = blogFormContainer.querySelector('.create-button')

    await user.type(titleInput, 'testing blog form: title...')
    await user.type(authorInput, 'Arthur Conan')
    await user.type(urlInput, 'https://arthur-conan.fakecom')
    await user.click(createButton)

    expect(createBlog.mock.calls).toHaveLength(1)
    expect(createBlog.mock.calls[0][0].title).toBe('testing blog form: title...')
    expect(createBlog.mock.calls[0][0].author).toBe('Arthur Conan')
    expect(createBlog.mock.calls[0][0].url).toBe('https://arthur-conan.fakecom')
})