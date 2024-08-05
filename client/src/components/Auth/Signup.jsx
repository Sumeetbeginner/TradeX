import React, { useEffect, useState } from "react";
import { auth, database } from "../../firebase.js"; 
import { createUserWithEmailAndPassword } from "firebase/auth";
import { ref, set, get, child } from "firebase/database";
import appLogo from "../../assets/icons/appLogo.png";
import './auth.css'
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(true)

  useEffect(() => { 
    setLoading(false)
  }, [])

  const location = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {

      setLoading(true);
      const dbRef = ref(database);
      const snapshot = await get(child(dbRef, `usernames/${username}`));

      if (snapshot.exists()) {

        setLoading(false)
        setError('Username already exists!');
        return;
      }

      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await set(ref(database, 'users/' + user.uid), {
        username: username,
        email: email,
        balance : 500000,
        salary : 50000,
        theme : 1,
      });


      await set(ref(database, 'usernames/' + username), {
        uid: user.uid,
      });

      setLoading(false)
      setSuccess('User registered successfully!');
      // console.log('User registered:', user);
      location('/login')
    } catch (error) {
      setLoading(false)
      setError(error.message);
      console.error('Error registering user:', error);
    }
  };

  if(loading) return <div className="loader"></div>

  return (
    <>
      <div className="signupForm">
        <div className="topSign">
          <img src={appLogo} alt="" />
          <h1>Sign Up</h1>
        </div>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Create Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <input
            type="email"
            placeholder="Enter Email ID"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Create Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit">Register</button>
        </form>

        <p>Already a Registered User? <span onClick={() => location('/login')}>Log In</span></p>

        {error && <p id="showError" className="error">{error}</p>}
        {success && <p id="showSuccess" className="success">{success}</p>}
      </div>
    </>
  );
};

export default Signup;
