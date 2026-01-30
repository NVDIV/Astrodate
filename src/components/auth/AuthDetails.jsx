import { onAuthStateChanged, signOut } from "firebase/auth"
import React, { useEffect, useState } from "react"
import { auth } from "../../services/firebase"

const AuthDetails = () => {
    const [authUser, setAuthUser]=useState(null)
    
    useEffect(() => {
        const listen = onAuthStateChanged(auth, (user) => {
            if (user) {
                setAuthUser(user);
            } else {
                setAuthUser(null);
            }
        });
        return () => {
            listen()
        }
    }, [])

    function userSignOut() {
        signOut(auth)
        .then(() => console.log("success"))
        .catch((e) => console.log(e));
    }
    
    return (
        <div className="auth-details-container">
            {authUser ? (
                <div>
                    <p>{ `Увійшли як: ${authUser.email}`}</p>
                    <button className="sign-out-btn" onClick={userSignOut}>Вийти з акаунта</button>
                </div>
            ) : (
                <div>
                    <p>Ви не увійшли в систему</p>
                </div>
            )}
        </div>
    )
}

export default AuthDetails