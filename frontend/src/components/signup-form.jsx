import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { useNavigate } from "react-router-dom"
import Toast from "./Toast";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import axios from 'axios'
import.meta.env.VITE_CLIENT_ID
import { GoogleLogin } from '@react-oauth/google'
import { useState } from "react"
import { uploadphoto } from "../cloudinary/Cloudinary"
import { useEffect } from "react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
export function SignupForm({
  className,
  ...props
}) {

  const [messageerror, setmessageerror] = useState('')

  const handelogin = async (respons) => {

    const googletoken = respons.credential
    console.log("this is the token", googletoken)
    await axios.post(`${import.meta.env.VITE_BASE_URL}/auth/token/google`,
      { token: googletoken }
    ).then((res) => {
      console.log(res.data.email, res.data.name, res.data.picture, "");
      console.log(res);
      setmessageerror(res.data.message)
      localStorage.setItem("token", res.data.accessToken);
      navigate("/dashboard");

    }).catch((err) => {
      console.log(err);
      setmessageerror(err.response.data.message)
    })
  }
  // all form data to send in backend

  const [username, setusername] = useState('')
  const [email, setemail] = useState('')
  const [password, setpassword] = useState('')
  const [photo, setphoto] = useState(null)
  const [isequal, setisequal] = useState('')
  const [issubmit, setissubmit] = useState(false)
  const [toastVisible, setToastVisible] = useState(false);
  const [toastText, setToastText] = useState("");
  const [toastType, setToastType] = useState("success");
  // navigation hook
  const navigate = useNavigate()

  // form submit function

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      if (!username || !email || !password || !photo) {
        console.log("Please fill all the fields")
        return
      }
      setissubmit(true)
      await axios.post(`${import.meta.env.VITE_BASE_URL}/auth/user/register`, {
        username: username,
        email: email,
        password: password,
        picture: photo
      }).then((res) => {
        console.log(res.data.message);
        setToastText("Login Successful!");
        setToastType("success");
        setToastVisible(true);
        
        localStorage.setItem("token", res.data.accessToken)
      }).catch((err) => {
        console.log(err.response.data.message);
        setToastText(err.response.data.message);
        setToastType("error");
        setToastVisible(true);
      })
    } catch (error) {
      console.log(error);

    }
    finally {
      setissubmit(false)
      if (localStorage.getItem("token")) {
        navigate("/dashboard")
      }
    }
  }
  useEffect(() => {
    const token = localStorage.getItem("token")
    if (token) {
      navigate("/dashboard")
    }
  }, [])

  // image upload  function

  const handleImageChange = (event) => {
    try {
      if (event.target.files && event.target.files[0]) {
        const file = event.target.files[0];

        uploadphoto(file).then(url => {
          setphoto(url)
          console.log("Uploaded photo URL:", url);
        }).catch(error => {
          console.error("Error uploading photo:", error);
        });

        console.log(file);
      }
      console.log(photo, "this is photo");

    } catch (error) {
      console.log(error);

    }

  };
  return (
    <>
      <form className={cn("flex flex-col gap-0", className)} {...props} onSubmit={handleSubmit}>

        <FieldGroup>
          <div className="flex flex-col items-center gap-1 text-center">
            <h1 className="text-2xl font-bold">Create your account</h1>
            <p className="text-muted-foreground text-sm text-balance">
              Fill in the form below to create your account
            </p>
          </div>

          {photo ? <div className="flex flex-row gap-7 justify-center items-center"> <img className="  rounded-full h-[100px] w-[100px] object-cover object-center" src={photo} alt="no photo" />
            <Button onClick={() => { setphoto(null) }}>delete</Button></div>
            : <>
              <Field>
                <FieldLabel
                  className="w-24 h-24 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden"
                  htmlFor="photo">Enter profile photo</FieldLabel>
                <Input className="hidden" onChange={handleImageChange} accept="image/*" id="photo" type="file" placeholder="Upload your photo" required />
                {!photo ? <p className="text-sm text-red-500 font-mono">
                  Upload a profile photo
                </p> : null}
              </Field>
            </>}

          <Field>
            <FieldLabel htmlFor="name">Full Name</FieldLabel>
            <Input value={username} onChange={(e) => setusername(e.target.value)} id="name" type="text" placeholder="John Doe" required />
            {username.length > 0 && username.length < 3 && <> <p className="text-sm text-red-500 font-mono">username must be 4 character long</p> </>}
          </Field>
          <Field>
            <FieldLabel htmlFor="email">Email</FieldLabel>
            <Input value={email} onChange={(e) => setemail(e.target.value)} id="email" type="email" placeholder="m@example.com" required />
            {email.includes("@gmail") && email.includes(".com") ? null : email.length > 0 ? <><p className="text-sm text-red-500 font-mono">Enter valid email</p></> : null}
          </Field>
          <Field>
            <FieldLabel htmlFor="password">Password</FieldLabel>
            <Input value={password} onChange={(e) => setpassword(e.target.value)} id="password" type="password" required />
            {password.length > 0 && password.length < 8 && <> <p className="text-sm text-red-500 font-mono">password must be 8 character long</p> </>}
            <FieldDescription>
              Must be at least 8 characters long.
            </FieldDescription>
          </Field>
          <Field>
            <FieldLabel htmlFor="confirm-password">Confirm Password</FieldLabel>
            <Input id="confirm-password" type="password" onChange={(e) => {

              setisequal(e.target.value)

            }} required />
            {isequal !== password ? <p className="text-sm text-red-500 font-mono">password not match</p> : null}
            <FieldDescription>Please confirm your password.</FieldDescription>
          </Field>
          <Field>
            <Button disabled={issubmit} type="submit">Create Account</Button>
          </Field>
          <FieldSeparator>Or continue with</FieldSeparator>
          <Field>
            <GoogleLogin
              className='mt-5 h-6 w-20'
              onSuccess={(e) => { handelogin(e) }}
              onError={(e) => {
                console.log(e);
              }}>
              Login with google
            </GoogleLogin>
            <FieldDescription className="px-6 text-center flex flex-row gap-1 justify-center">
              Already have an account? <p className="underline cursor-pointer font-mono" onClick={() => navigate('/auth/login')}>Log in</p>
            </FieldDescription>
          </Field>
        </FieldGroup>
        { messageerror ? <p className="text-red-500 text-2xl font-bold">{messageerror}</p> : '' }
      </form>
      <Toast
        message={toastText}
        type={toastType}
        visible={toastVisible}
        onClose={() => setToastVisible(false)}
      />
    </>

  );
}
