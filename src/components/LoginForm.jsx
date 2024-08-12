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
                        id='username'
                        data-testid='username'
                        type='text'
                        value={username}
                        name='Username'
                        onChange={handleUsernameChange} />
                </div>
                <div >
                    password
                    <input
                        id='password'
                        data-testid='password'
                        type='password'
                        value={password}
                        name='Password'
                        onChange={handlePasswordChange} />
                </div>
                <button id='login-button' type='submit'>login</button>
            </form>
        </>
    )
}

export default LoginForm