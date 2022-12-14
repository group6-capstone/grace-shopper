import React, { useState } from "react";
import { useNavigate } from 'react-router-dom'
import { registerUser } from '../axios-services/users';
import { createUserCart } from "../axios-services/cart";


const Register = ({ isLoggedIn, user,  guestCart, setGuestCart }) => {
    const [email, setEmail] = useState('');
    const [first_name, setFirst_name] = useState('');
    const [last_name, setLast_name] = useState('');
    const [password, setPassword] = useState('');
    // const [confirmPassword, setConfirmPassword] = useState('');
    const [token, setToken] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [newPw1, setNewPw1] = useState('');
    const [newPw2, setNewPw2] = useState('');
    const [myCart, setMyCart] = useState({})
    
    const navigate = useNavigate();
    

    const handleSubmit = async (event) => {
        event.preventDefault();
        const user = {
            email,
            password,
            first_name,
            last_name
        }
        const data = await registerUser(user);

        localStorage.setItem('token', data.token);
        setToken(data.token);
        setErrorMessage(data.message);
        await createUserCart({
            user_id: data.user.id,
            order_status: "active"
        })
        navigate("/login");
    }

    return (
        <div id="register">
            <p>{isLoggedIn ? `You're Logged In as ${user.first_name}` : `You are not logged in`}</p>
            <h1>Register</h1>
            <p>{errorMessage}</p>
            <form onSubmit={handleSubmit}>
                <label>
                    Email:
                    <input className="text-box" type="text" name="email" onChange={(event) => {
                        setEmail(event.target.value);
                    }} /><br></br>
                </label>
                <label>
                    First name:
                    <input className="text-box" type="text" name="firstname" onChange={(event) => {
                        setFirst_name(event.target.value);
                    }} /><br></br>
                </label>
                <label>
                    Last name:
                    <input className="text-box" type="text" name="lastname" onChange={(event) => {
                        setLast_name(event.target.value);
                    }} /><br></br>
                </label>
                <label>
                    Password:
                    <input value={newPw1} minLength="8" className="text-box" type="password" name="password" onChange={(event) => {
                        setNewPw1(event.target.value);
                    }} /><br></br>

                </label>
                <label>
                    Confirm Password:
                    <input value={newPw2} className="text-box" type="password" name="confirmPassword"
                        onChange={(event) => {
                            setNewPw2(event.target.value);
                        }}
                        onInput={(event) => {
                            setPassword(event.target.value)
                        }}
                    /><br></br>
                </label>
                <button className="button" type="submit"
                    disabled={(newPw1 === newPw2) ? false : true}
                >Register</button>
                <p>{(newPw1 === newPw2) ? null : "Passwords must be matching"}</p>
            </form>
        </div>
    );
};



export default Register;