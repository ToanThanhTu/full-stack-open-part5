const LoginForm = ({
    username,
    password,
    handleLogin,
    handleUsernameChange,
    handlePasswordChange,
    children
}) => {
    return (
        <>
            <h1>log in to application</h1>
            {/* Notification */}
            {children}
            <form onSubmit={handleLogin}>
                <div>
                    username
                    <input
                        data-testid='username'
                        type='text'
                        value={username}
                        name='Username'
                        onChange={handleUsernameChange} />
                </div>
                <div >
                    password
                    <input
                        data-testid='password'
                        type='password'
                        value={password}
                        name='Password'
                        onChange={handlePasswordChange} />
                </div>
                <button type='submit'>login</button>
            </form>
        </>
    )
}

export default LoginForm