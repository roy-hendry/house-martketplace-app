import { useState } from "react";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { ReactComponent as ArrowRightIcon } from "../assets/svg/keyboardArrowRightIcon.svg";
import visibilityIcon from "../assets/svg/visibilityIcon.svg";

function SignIn() {
	const [showPassword, setShowPassword] = useState(false);
	const [formData, setFormData] = useState({
		email: "",
		password: "",
	});
	const { email, password } = formData;

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
			const auth = getAuth();

			const userCredential = await signInWithEmailAndPassword(
				auth,
				email,
				password
			);

			if (userCredential.user) {
				navigate("/");
			}
		} catch (error) {
			toast.error("Bad User Credentials");
		}
	};

	return (
		<>
			<div className="pageContainer">
				<header>
					<h1 className="pageTitle">Welcome Back!</h1>
				</header>
				<form onSubmit={onSubmit}>
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
					<div className="signInBar">
						<p className="signInText">Sign In</p>
						<button className="signInButton">
							<ArrowRightIcon
								fill="#ffffff"
								width="34px"
								height="34px"
							/>
						</button>
					</div>
				</form>
				{/* Google OAuth */}
				<Link className="registerLink" to="/sign-up" type="sign-up">
					Sign Up Instead
				</Link>
			</div>
		</>
	);
}

export default SignIn;
