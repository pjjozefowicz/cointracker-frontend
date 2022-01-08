export default async function({$auth}) {
    if($auth.loggedIn) {
        console.log("You're logged in bro")
    } else {
        $auth.loginWith('auth0')
    }
}