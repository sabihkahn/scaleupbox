import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
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

export function SignupForm({
  className,
  ...props
}) {
  const handelogin = async (respons) => {

    const googletoken = respons.credential
    console.log("this is the token", googletoken)
    await axios.post(`${import.meta.env.VITE_BASE_URL}/auth/token/google`,
      { token: googletoken }
    ).then((res) => {
      console.log(res.data.email, res.data.name, res.data.picture, "");
      console.log(res);

    }).catch((err) => {
      console.log(err);
    })
  }
  // all form data to send in backend

  const [username, setusername] = useState('')
  const [email, setemail] = useState('')
  const [password, setpassword] = useState('')
  const [photo, setphoto] = useState(null)
  function handleSubmit(e) {
    e.preventDefault();
    const data = {
      name: username,
      email: email,
      password: password
    }
    console.log(data);
  }
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
    <form className={cn("flex flex-col gap-0", className)} {...props} onSubmit={handleSubmit}>
      <FieldGroup>
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-2xl font-bold">Create your account</h1>
          <p className="text-muted-foreground text-sm text-balance">
            Fill in the form below to create your account
          </p>
        </div>

        {photo ? <div className="flex flex-col"> <img className="  rounded-b-full object-cover object-center" src={photo} alt="no photo" />
          <Button onClick={() => { setphoto(null) }}>delete</Button></div>
          : <>
            <Field>
              <FieldLabel
                className="w-24 h-24 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden"
                htmlFor="photo">Enter profile photo</FieldLabel>
              <Input className="hidden" onChange={handleImageChange} accept="image/*" id="photo" type="file" placeholder="Upload your photo" required />
            </Field>
          </>}

        <Field>
          <FieldLabel htmlFor="name">Full Name</FieldLabel>
          <Input value={username} onChange={(e) => setusername(e.target.value)} id="name" type="text" placeholder="John Doe" required />
        </Field>
        <Field>
          <FieldLabel htmlFor="email">Email</FieldLabel>
          <Input value={email} onChange={(e) => setemail(e.target.value)} id="email" type="email" placeholder="m@example.com" required />
          {/* <FieldDescription>
            We&apos;ll use this to contact you. We will not share your email
            with anyone else.
          </FieldDescription> */}
        </Field>
        <Field>
          <FieldLabel htmlFor="password">Password</FieldLabel>
          <Input value={password} onChange={(e) => setpassword(e.target.value)} id="password" type="password" required />
          <FieldDescription>
            Must be at least 8 characters long.
          </FieldDescription>
        </Field>
        <Field>
          <FieldLabel htmlFor="confirm-password">Confirm Password</FieldLabel>
          <Input id="confirm-password" type="password" required />
          <FieldDescription>Please confirm your password.</FieldDescription>
        </Field>
        <Field>
          <Button type="submit">Create Account</Button>
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
          <FieldDescription className="px-6 text-center">
            Already have an account? <a href="#">Sign in</a>
          </FieldDescription>
        </Field>
      </FieldGroup>
    </form>
  );
}
