import { useState, useEffect, useRef } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import Spinner from "../components/Spinner";

function CreateListing() {
	const [geolocationEnabled, setGeolocationEnabled] = useState(true);
	const [loading, setLoading] = useState(false);
	const [formData, setFormData] = useState({
		type: "rent",
		name: "",
		bedrooms: "1",
		bathrooms: "1",
		parking: false,
		furnished: false,
		address: "",
		offer: false,
		regularPrice: 50,
		discountedPrice: 50,
		images: {},
		latitude: 0,
		longitude: 0,
	});

	// We deconstructed formData so we don't need to type 'formData.bedrooms' instead we can type 'bedrooms'
	const {
		type,
		name,
		bedrooms,
		bathrooms,
		parking,
		furnished,
		address,
		offer,
		regularPrice,
		discountedPrice,
		images,
		latitude,
		longitude,
	} = formData;

	const auth = getAuth();
	const navigate = useNavigate();
	const isMounted = useRef(true);

	useEffect(() => {
		if (isMounted) {
			onAuthStateChanged(auth, (user) => {
				if (user) {
					setFormData({ ...formData, userRef: user.uid });
				} else {
					navigate("/sign-in");
				}
			});
		}
		return () => {
			isMounted.current = false;
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [isMounted]);

	const onSubmit = (e) => {
		e.preventDefault();
		console.log(formData);
	};

	// We use onMutate as a onChange type of method
	// e.target.value needs to be checked against the String form of true as it isn't stored as a boolean value, we convert it after
	const onMutate = (e) => {
		let boolean = null;

		if (e.target.value === "true") {
			boolean = true;
		}

		if (e.target.value === "false") {
			boolean = false;
		}

		// Files
		if (e.target.files) {
			setFormData((prevState) => ({
				...prevState,
				images: e.target.files,
			}));
		}

		// Text/Booleans/Numbers
		if (!e.target.files) {
			setFormData((prevState) => ({
				...prevState,
				// The ?? means "If this value is null then do this"
				[e.target.id]: boolean ?? e.target.value,
			}));
		}
	};

	if (loading) {
		return <Spinner />;
	}

	return (
		<div className="profile">
			<header>
				<p className="pageTitle">Create a Listing</p>
			</header>

			<main>
				<form onSubmit={onSubmit}>
					<label className="formLabel">Sell / Rent</label>
					<div className="formButtons">
						<button
							className={
								type === "sale"
									? "formButtonActive"
									: "formButton"
							}
							id="type"
							value="sale"
							onClick={onMutate}
							type="button"
						>
							Sell
						</button>

						<button
							className={
								type === "rent"
									? "formButtonActive"
									: "formButton"
							}
							id="type"
							value="rent"
							onClick={onMutate}
							type="button"
						>
							Rent
						</button>
					</div>

					<label className="formLabel">Name</label>
					<input
						className="formInputName"
						type="text"
						id="name"
						value={name}
						onChange={onMutate}
						maxLength="32"
						minLength="10"
						required
					/>

					<div className="formRooms flex">
						<div>
							<label className="formLabel">Bedrooms</label>
							<input
								className="formInputSmall"
								// Due to type being number this changes the box so that it has 2 arrows, at the side to increment or decrement the value
								type="number"
								id="bedrooms"
								value={bedrooms}
								onChange={onMutate}
								min="1"
								max="50"
								required
							/>
						</div>

						<div>
							<label className="formLabel">Bathrooms</label>
							<input
								className="formInputSmall"
								type="number"
								id="bathrooms"
								value={bathrooms}
								onChange={onMutate}
								min="1"
								max="50"
								required
							/>
						</div>
					</div>

					<label className="formLabel">Parking spot</label>
					<div className="formButtons">
						<button
							className={
								parking ? "formButtonActive" : "formButton"
							}
							type="button"
							id="parking"
							value={true}
							onClick={onMutate}
							min="1"
							max="50"
						>
							Yes
						</button>
						<button
							className={
								!parking && parking !== null
									? "formButtonActive"
									: "formButton"
							}
							type="button"
							id="parking"
							value={false}
							onClick={onMutate}
							min="1"
							max="50"
						>
							No
						</button>
					</div>

					<label className="formLabel">Furnished</label>
					<div className="formButtons">
						<button
							className={
								furnished ? "formButtonActive" : "formButton"
							}
							type="button"
							id="furnished"
							value={true}
							onClick={onMutate}
							min="1"
							max="50"
						>
							Yes
						</button>
						<button
							className={
								!furnished && furnished !== null
									? "formButtonActive"
									: "formButton"
							}
							type="button"
							id="furnished"
							value={false}
							onClick={onMutate}
							min="1"
							max="50"
						>
							No
						</button>
					</div>

					<label className="formLabel">Address</label>
					<textarea
						className="formInputAddress"
						type="text"
						id="address"
						value={address}
						onChange={onMutate}
						required
					/>
					{/* Provided geolocationEnabled is false there will be a latitude and longitude box for  users to enter */}
					{!geolocationEnabled && (
						<div className="formLatLng flex">
							<div>
								<label className="formLabel">Latitude</label>
								<input
									className="formInputSmall"
									type="number"
									id="latitude"
									value={latitude}
									onChange={onMutate}
									required
								/>
							</div>
							<div>
								<label className="formLabel">Longitude</label>
								<input
									className="formInputSmall"
									type="number"
									id="longitude"
									value={longitude}
									onChange={onMutate}
									required
								/>
							</div>
						</div>
					)}

					<label className="formLabel">Offer</label>
					<div className="formButtons">
						<button
							className={
								offer ? "formButtonActive" : "formButton"
							}
							type="button"
							id="offer"
							value={true}
							onClick={onMutate}
						>
							Yes
						</button>
						<button
							className={
								!offer && offer !== null
									? "formButtonActive"
									: "formButton"
							}
							type="button"
							id="offer"
							value={false}
							onClick={onMutate}
						>
							No
						</button>
					</div>

					<label className="formLabel">Regular Price</label>
					<div className="formPriceDiv">
						<input
							className="formInputSmall"
							type="number"
							id="regularPrice"
							value={regularPrice}
							onChange={onMutate}
							min="50"
							max="750000000"
						/>
						{type === "rent" && (
							<p className="formPriceText">$ / Month</p>
						)}
					</div>

					{offer && (
						<>
							<label className="formLabel">
								Discounted Price
							</label>
							<input
								className="formInputSmall"
								type="number"
								id="discountedPrice"
								value={discountedPrice}
								onChange={onMutate}
								min="50"
								max="750000000"
							/>
						</>
					)}

					<label className="formLabel">Images</label>
					<p className="imagesInfo">
						The first image will be the cover (max 6).
					</p>
					<input
						className="formInputFile"
						type="file"
						id="images"
						onChange={onMutate}
						max="6"
						accept=".jpg,.png,.jpeg"
						multiple
						required
					/>
					<button
						className="primaryButton createListingButton"
						type="submit"
					>
						Create Listing
					</button>
				</form>
			</main>
		</div>
	);
}

export default CreateListing;
