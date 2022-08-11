import { useLocation, useNavigate } from "react-router-dom";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase.config";
import { toast } from "react-toastify";
import googleIcon from "../assets/svg/googleIcon.svg";

function OAuth() {
	const navigate = useNavigate();
	const location = useLocation();

	const onGoogleClick = async () => {
		try {
			const auth = getAuth();
			// This is how we use Google's authentication to sign in with Google
			const provider = new GoogleAuthProvider();
			const result = await signInWithPopup(auth, provider);
			// Get the user from the Google sign in
			const user = result.user;

			// Pass the user ID into here to check if we have a reference to that document
			const docRef = doc(db, "users", user.uid);
			const docSnap = await getDoc(docRef);

			// If user doesn't exist, create user
			if (!docSnap.exists()) {
				// Adding the relavent data to the database
				await setDoc(doc(db, "users", user.uid), {
					name: user.displayName,
					email: user.email,
					timestamp: serverTimestamp(),
				});
			}
			navigate("/");
		} catch (error) {
			toast.error("Could not authorize with Google");
		}
	};

	return (
		<div className="socialLogin">
			<p>Sign {location.pathname === "/sign-up" ? "up" : "in"} with</p>
			<button className="socialIconDiv" onClick={onGoogleClick}>
				<img className="socialIconImg" src={googleIcon} alt="google" />
			</button>
		</div>
	);
}

export default OAuth;
