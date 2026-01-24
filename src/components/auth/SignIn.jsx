import { signInWithEmailAndPassword } from "firebase/auth"
import React, { useState } from "react"
import { auth } from "../../services/firebase"

const SignIn = () => {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")

    function logIn(e) {
        e.preventDefault()

        signInWithEmailAndPassword(auth, email, password)
        .then((user) => {
            console.log(user)
            setError("");
            setEmail("");
            setPassword("");
        })
        .catch((error) => {
            console.log(error)
            setError("Sorry, couldn't find your account")
        });
    }

    return (
        <div>
            <form onSubmit={logIn}>
                <h2>Sign In</h2>
                <input placeholder="Email" value={email} onChange={(e)=>setEmail(e.target.value)} type="email" />
                <input placeholder="Password" value={password} onChange={(e)=>setPassword(e.target.value)} type="password" />
                <button>Log In</button>
                {error ? <p style={{color:"red"}}>{error}</p> : ""}
            </form>
        </div>
    )
}

export default SignIn