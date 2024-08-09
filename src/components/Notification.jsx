import '../index.css'
import PropTypes from 'prop-types'

const Notification = ({ message, type }) => {
    if (message === null) {
        return null
    }

    return (
        <div className={type}>
            {message}
        </div>
    )
}

export default Notification