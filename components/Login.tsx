import { useSession, signIn, signOut } from 'next-auth/react';


/*type session = {
    expires: String,
    user : {
        email : String,
        name? : String,
        image? : String
    }
}*/


export default function Login() {
    const {data: sessionData, status}  = useSession();
    const session : any = sessionData;
    console.log(session) 
    if (status === "authenticated"){
        return (
            <div>
                <p>Signed in as {session.user.email}</p>
                <button onClick={() => signOut()}>SignOut</button>
            </div>
        )
    }else{
        return (
            <div>
                <p>Not Signed In</p>
                <button onClick={() => signIn()}>SignIn</button>
            </div>
        )
    }

}