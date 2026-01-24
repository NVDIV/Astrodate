import { createUserWithEmailAndPassword } from "firebase/auth"
import React, { useState } from "react"
import { auth } from "../../services/firebase"

const SignUp = () => {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [copyPassword, setCopyPassword] = useState("")
    const [error, setError] = useState("")

    function register(e) {
        e.preventDefault()

        if (copyPassword != password) {
            setError("Passwords didn't match")
            return
        }

        createUserWithEmailAndPassword(auth, email, password)
        .then((user) => {
            console.log(user)
            setError("");
            setEmail("");
            setPassword("");
            setCopyPassword("");
        })
        .catch((error) => console.log(error));
    }

    return (
        <div>
            <form onSubmit={register}>
                <h2>Sign Up</h2>
                <input placeholder="Email" value={email} onChange={(e)=>setEmail(e.target.value)} type="email" />
                <input placeholder="Password" value={password} onChange={(e)=>setPassword(e.target.value)} type="password" />
                <input placeholder="Repeat Password" value={copyPassword} onChange={(e)=>setCopyPassword(e.target.value)} type="password" />
                <button>Sign Up</button>
                {error ? <p style={{color:"red"}}>{error}</p> : ""}
            </form>
        </div>
    )
}

export default SignUp