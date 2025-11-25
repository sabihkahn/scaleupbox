import React from 'react'
import axios from 'axios'
import.meta.env.VITE_CLIENT_ID
import { GoogleLogin } from '@react-oauth/google'



const AuthwithGoogle = () => {

    const handelogin = async (respons) => {
      
        const googletoken = respons.credential
        console.log("this is the token", googletoken)
        await axios.post(`${import.meta.env.VITE_BASE_URL}/auth/token/google`, 
            {token: googletoken}
        ).then((res) => {
            console.log(res.data.email, res.data.name, res.data.picture, "");
            console.log(res);

        }).catch((err) => {
            console.log(err);
        })
    }


    return (
        <>
            <div className='text-2xl bg-amber-200 w-full'>Login here</div>
            <GoogleLogin
            className='mt-5 h-6 w-20'
                onSuccess={(e) => { handelogin(e) }}
                onError={(e) => {
                    console.log(e);
                }}>
                Login with google
            </GoogleLogin>
        </>
    )
}

export default AuthwithGoogle