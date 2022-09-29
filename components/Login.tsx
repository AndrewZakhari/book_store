import { useSession, signIn, signOut } from 'next-auth/react';



export default function Login() {
    const {data: session, status} = useSession();
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