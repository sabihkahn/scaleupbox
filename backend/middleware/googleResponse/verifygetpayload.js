
import { OAuth2Client } from 'google-auth-library'


// google client id 
const CLIENT_ID = process.env.CLIENT_ID;
const GOOGLE_CLIENT = new OAuth2Client(CLIENT_ID);

export const googleAuthmiddelware = async (req,res,next) => {
   
    const { token } = req.body
    try {
      if(!token){
        return res.status(400).json({
            message:"token does not provided from client",
            success:false
        })
      }
        
        const ticket = await GOOGLE_CLIENT.verifyIdToken({
            idToken: token,
            audience: CLIENT_ID,
        });
        const payload = ticket.getPayload();
       
    
    req.userfromgoogle = payload;
    next();
    
    
    } catch (error) {
        console.log(error);
    }




}