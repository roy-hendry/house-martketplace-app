import { useState, useEffect, useRef } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import {
	getStorage,
	ref,
	uploadBytesResumable,
	getDownloadURL,
} from "firebase/storage";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase.config";
import { useNavigate } from "react-router-dom";
import Spinner from "../components/Spinner";
import { toast } from "react-toastify";
import { v4 as uuidv4 } from "uuid";

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

	const onSubmit = async (e) => {
		e.preventDefault();

		setLoading(true);

		if (discountedPrice >= regularPrice) {
			setLoading(false);
			toast.error("Discounted price needs to be less than regular price");
			return;
		}

		if (images.length > 6) {
			setLoading(false);
			toast.error("Max 6 images");
			return;
		}

		let geolocation = {};
		let location;

		if (geolocationEnabled) {
			const response = await fetch(
				`https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${process.env.REACT_APP_GOOGLE_API_KEY}`
			);

			const data = await response.json();

			// Getting the latitude and longitude of the address specified
			// The ? after the array position is because we will get an error stating that position 0 is null otherwise
			geolocation.lat = data.results[0]?.geometry.location.lat ?? 0;
			geolocation.lng = data.results[0]?.geometry.location.lng ?? 0;

			location =
				data.status === "ZERO_RESULTS"
					? undefined
					: data.results[0]?.formatted_address;

			if (location === undefined || location.includes("undefined")) {
				setLoading(false);
				toast.error("Please enter a valid address");
				return;
			}
		} else {
			geolocation.lat = latitude;
			geolocation.lng = longitude;
		}

		// Store image in firebase
		const storeImage = async (image) => {
			return new Promise((resolve, reject) => {
				const storage = getStorage();
				const fileName = `${auth.currentUser.uid}-${
					image.name
				}-${uuidv4()}`;

				const storageRef = ref(storage, "images/" + fileName);

				const uploadTask = uploadBytesResumable(storageRef, image);

				uploadTask.on(
					"state_changed",
					(snapshot) => {
						const progress =
							(snapshot.bytesTransferred / snapshot.totalBytes) *
							100;
						console.log("Upload is " + progress + "% done");
						switch (snapshot.state) {
							case "paused":
								console.log("Upload is paused");
								break;
							case "running":
								console.log("Upload is running");
								break;
							default:
						}
					},
					(error) => {
						reject(error);
					},
					() => {
						// Handle successful uploads on complete
						// For instance, get the download URL: https://firebasestorage.googleapis.com/...
						getDownloadURL(uploadTask.snapshot.ref).then(
							(downloadURL) => {
								resolve(downloadURL);
							}
						);
					}
				);
			});
		};

		const imgUrls = await Promise.all(
			[...images].map((image) => storeImage(image))
		).catch(() => {
			setLoading(false);
			toast.error("Images not uploaded");
			return;
		});

		// Taking fields we want from formData then adding some extras we already have set up the way we want
		const formDataCopy = {
			...formData,
			imgUrls,
			geolocation,
			timestamp: serverTimestamp(),
		};

		formDataCopy.location = address;
		// Removing fields we don't want from formData
		delete formDataCopy.images;
		delete formDataCopy.address;
		!formDataCopy.offer && delete formDataCopy.discountedPrice;

		// Saving to the database
		const docRef = await addDoc(collection(db, "listings"), formDataCopy);

		setLoading(false);
		toast.success("Listing saved");
		navigate(`/category/${formDataCopy.type}/${docRef.id}`);
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
