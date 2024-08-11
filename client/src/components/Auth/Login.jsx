import React, { useState, useContext } from 'react';
import { signInWithEmailAndPassword as signInWithEmailAndPasswordV9 } from 'firebase/auth';
import { ref, onValue } from 'firebase/database';
import { auth, database } from '../../firebase.js';
import { UserContext } from '../../UserContext.jsx';
import { useNavigate } from 'react-router-dom';
import appLogo from '../../assets/icons/appLogo.png';
import { sendPasswordResetEmail } from 'firebase/auth';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { setUser } = useContext(UserContext);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const userCredential = await signInWithEmailAndPasswordV9(auth, email, password);
      const userAuth = userCredential.user;

      if (userAuth) {
        const userRef = ref(database, `users/${userAuth.uid}`);

        const fetchUserData = new Promise((resolve) => {
          onValue(userRef, (snapshot) => {
            const userData = snapshot.val();
            setUser({ uid: userAuth.uid, ...userData });
            resolve();
          });
        });

        await fetchUserData;
        setLoading(false);
        navigate('/');
      }
    } catch (error) {
      setLoading(false);
      setError('Invalid email or password');
      console.error('Error logging in:', error);
    }
  };

  if (loading) return <div className="loader"></div>;

  const handleForgotPassword = async () => {
    if (!email) {
      setError('Please enter your email address');
      return;
    }
  
    setLoading(true);
  
    try {
      await sendPasswordResetEmail(auth, email);
      setLoading(false);
      setError('Password reset email sent! Please check your inbox.');
    } catch (error) {
      setLoading(false);
      setError('Failed to send password reset email. Please try again.');
      console.error('Error sending password reset email:', error);
    }
  };

  return (
    <div className="signupForm">
      <div className="topSign">
        <img src={appLogo} alt="App Logo" />
        <h1>Login</h1>
      </div>

      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Enter Email ID"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Enter Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit" disabled={loading}>Login</button>
      </form>



      <p>Forgot Password? <span onClick={() => handleForgotPassword()}>Reset Password</span></p>

      <p>OR</p>

      <p>New User? <span onClick={() => navigate('/signup')}>Sign Up</span></p>

      {error && <p id="showError" className="error">{error}</p>}
    </div>
  );
};

export default Login;
     