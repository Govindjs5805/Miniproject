function Register() {
  return (
    <div style={{ padding: "60px", maxWidth: "400px", margin: "auto" }}>
      <h2>Register</h2>
      <p>Create a new account</p>

      <form style={{ marginTop: "20px" }}>
        <div style={{ marginBottom: "15px" }}>
          <label>Name</label><br />
          <input
            type="text"
            placeholder="Enter name"
            style={{ width: "100%", padding: "10px" }}
          />
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label>Email</label><br />
          <input
            type="email"
            placeholder="Enter email"
            style={{ width: "100%", padding: "10px" }}
          />
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label>Password</label><br />
          <input
            type="password"
            placeholder="Create password"
            style={{ width: "100%", padding: "10px" }}
          />
        </div>

        <button style={{ width: "100%", padding: "10px" }}>
          Register
        </button>
      </form>
    </div>
  );
}

export default Register;