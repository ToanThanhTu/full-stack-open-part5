import { forwardRef, useImperativeHandle, useState } from 'react'
import PropTypes from 'prop-types'

// use forwardRef to enable Refs
const Togglable = forwardRef((props, refs) => {
    const [visible, setVisible] = useState(false)

    // show/hide display style
    const showWhenVisible = {
        display: visible ? '' : 'none'
    }

    const hideWhenVisible = {
        display: visible ? 'none' : ''
    }

    const toggleVisibility = () => {
        setVisible(!visible)
    }

    // useImperativeHandle hook to allow other component to use toggleVisibility()
    useImperativeHandle(refs, () => {
        return {
            toggleVisibility
        }
    })

    return (
        <div>
            <button style={hideWhenVisible} onClick={toggleVisibility}>
                {props.buttonLabel}
            </button>
            <div style={showWhenVisible}>
                {props.children}
                <button onClick={toggleVisibility}>
                    cancel
                </button>
            </div>
        </div>
    )
})

Togglable.propTypes = {
    buttonLabel: PropTypes.string.isRequired
}

Togglable.displayName = 'Togglable'

export default Togglable