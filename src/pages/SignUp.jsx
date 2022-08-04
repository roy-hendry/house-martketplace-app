import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
	getAuth,
	createUserWithEmailAndPassword,
	updateProfile,
} from "firebase/auth";
import { db } from "../firebase.config";
import { ReactComponent as ArrowRightIcon } from "../assets/svg/keyboardArrowRightIcon.svg";
import visibilityIcon from "../assets/svg/visibilityIcon.svg";

function SignUp() {
	const [showPassword, setShowPassword] = useState(false);
	const [formData, setFormData] = useState({
		name: "",
		email: "",
		password: "",
	});
	const { name, email, password } = formData;

	const navigate = useNavigate();

	const onChange = (e) => {
		setFormData((prevState) => ({
			...prevState,
			// By us using e.target.id we can make this method work for both email and password without needing to write them in individually
			// It is based off the formData names above
			[e.target.id]: e.target.value,
		}));
	};

	const onSubmit = async (e) => {
		e.preventDefault();

		try {
			// We get auth
			const auth = getAuth();

			// This is how we register the user, this returns a promise
			const userCredential = await createUserWithEmailAndPassword(
				auth,
				email,
				password
			);

			// How we get the user info, we need this for the database
			const user = userCredential.user;

			// Updating display name
			updateProfile(auth.currentUser, {
				displayName: name,
			});

			// Redirecting
			navigate("/");
		} catch (error) {
			console.log(error);
		}
	};

	return (
		<>
			<div className="pageContainer">
				<header>
					<p className="pageHeader">Welcome Back!</p>
				</header>
				<form onSubmit={onSubmit}>
					<input
						className="nameInput"
						type="text"
						placeholder="Name"
						id="name"
						value={name}
						onChange={onChange}
					/>
					<input
						className="emailInput"
						type="email"
						placeholder="Email"
						id="email"
						value={email}
						onChange={onChange}
					/>
					<div className="passwordInputDiv">
						<input
							className="passwordInput"
							type={showPassword ? "text" : "password"}
							placeholder="Password"
							id="password"
							value={password}
							onChange={onChange}
						/>

						<img
							className="showPassword"
							src={visibilityIcon}
							alt="Show password"
							onClick={() =>
								setShowPassword((prevState) => !prevState)
							}
						/>
					</div>
					<Link className="forgotPasswordLink" to="/forgot-password">
						Forgot Password
					</Link>
					<div className="signUpBar">
						<p className="signUpText">Sign Up</p>
						<button className="signUpButton">
							<ArrowRightIcon
								fill="#ffffff"
								width="34px"
								height="34px"
							/>
						</button>
					</div>
				</form>
				{/* Google OAuth */}

				<Link className="registerLink" to="/sign-in">
					Sign In Instead
				</Link>
			</div>
		</>
	);
}

export default SignUp;
