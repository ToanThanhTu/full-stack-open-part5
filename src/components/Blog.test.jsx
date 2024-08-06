import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

describe('<Blog />', () => {
    let container
    let mockUser
    let mockDeleteBlog
    let mockUpdateBlog
    let mockBlog

    beforeEach(() => {
        mockUser = {
            username: 'trev'
        }

        mockDeleteBlog = vi.fn()
        mockUpdateBlog = vi.fn()

        mockBlog = {
            title: 'Blog Component Testing',
            author: 'Leonard Vine',
            url: 'https://fakeurl.com',
            likes: 23
        }

        container = render(
            <Blog
                blog={mockBlog}
                deleteBlog={mockDeleteBlog}
                updateBlog={mockUpdateBlog}
                user={mockUser}
            />
        ).container

        screen.debug(container)
    })

    test('renders title and author, but not url and likes by default', () => {
        const titleAndAuthor = screen.getByText('Blog Component Testing - Leonard Vine')
        expect(titleAndAuthor).toBeDefined()

        const blogInfo = container.querySelector('.blog-info')
        expect(blogInfo).toHaveStyle('display: none') // the div that contains url and likes is not displayed
    })

    test('shows url and likes after view button is clicked', async () => {
        const user = userEvent.setup()
        const viewButton = container.querySelector('.view-button')

        await user.click(viewButton)

        // has url and likes after clicking 'view' btn
        const urlElement = screen.getByText('https://fakeurl.com')
        const likesElement = screen.getByText('likes 23')
    })

    test('calls addLike twice if like button is clicked twice', async () => {
        const user = userEvent.setup()

        const viewButton = container.querySelector('.view-button')

        await user.click(viewButton)

        const likeButton = container.querySelector('.like-button')

        await user.click(likeButton)
        await user.click(likeButton)

        expect(mockUpdateBlog.mock.calls).toHaveLength(2)
    })
})