function Login() {
    return(
        <div style={{padding: "60px", maxWidth: "400px", margin: "auto"}}>
            <h2>Login</h2>
            <p>Login to access campus events</p>
            
            <form style={{marginTop: "20px"}}>
                <div style={{marginBottom: "15px"}}>
                    <label>Email</label><br />
                    <input 
                        type = "email"
                        placeholder="Enter email"
                        style={{width: "100%", padding: "10px"}}
                    />
                </div>
                <div style={{marginBottom: "15px"}}>
                    <lable>Password</lable><br />
                    <input
                        type = "password"
                        placeholder="Enter password"
                        style={{width: "100%", padding: "10px"}}
                    />
                </div>

                <button style={{width: "100%", padding: "10px"}}>
                    Login
                </button>
            </form>
        </div>
    );
}
export default Login;