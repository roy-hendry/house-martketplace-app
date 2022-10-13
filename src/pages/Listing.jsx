import { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import SwiperCore, { Navigation, Pagination, Scrollbar, A11y } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { getDoc, doc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { db } from "../firebase.config";
import Spinner from "../components/Spinner";
import shareIcon from "../assets/svg/shareIcon.svg";
SwiperCore.use([Navigation, Pagination, Scrollbar, A11y]);

function Listing() {
	const [listing, setListing] = useState(null);
	const [loading, setLoading] = useState(true);
	const [shareLinkCopied, setShareLinkCopied] = useState(false);

	const navigate = useNavigate();
	const params = useParams();
	const auth = getAuth();

	useEffect(() => {
		const fetchListing = async () => {
			const docRef = doc(db, "listings", params.listingId);
			const docSnap = await getDoc(docRef);

			if (docSnap.exists()) {
				setListing(docSnap.data());
				setLoading(false);
			}
		};

		fetchListing();
	}, [navigate, params.listingId]);

	if (loading) {
		return <Spinner />;
	}

	return (
		<main>
			<Swiper
				spaceBetween={50}
				slidesPerView={1}
				pagination={{ clickable: true }}
			>
				{/* Depending on the number of images in the array for the imgUrls there will be the amount of props rendered accordingly. This way there will only be slides for each of the pictures the creator of this post has selected*/}
				{listing.imgUrls.map((imageUrl, index) => (
					<SwiperSlide key={index}>
						<img
							className="swiperSlideImg"
							src={imageUrl}
							alt="Images of the house"
						/>
					</SwiperSlide>
				))}
			</Swiper>

			{/* Copy share link */}
			<div
				className="shareIconDiv"
				onClick={() => {
					navigator.clipboard.writeText(window.location.href);
					setShareLinkCopied(true);
					// After some time has passed you can copy the link again
					setTimeout(() => {
						setShareLinkCopied(false);
					}, 2000);
				}}
			>
				<img src={shareIcon} alt="" />
			</div>

			{shareLinkCopied && <p className="linkCopied">Link Copied!</p>}
			<div className="listingDetails">
				<p className="listingName">
					{listing.name} -{" $"}
					{listing.offer
						? listing.discountedPrice
								.toString()
								.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
						: listing.regularPrice
								.toString()
								.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
				</p>
				<p className="listLocation">{listing.location}</p>
				<p className="listingType">
					For {listing.type === "rent" ? "Rent" : "Sale"}
				</p>
				{/* Shows how much the property has been discounted */}
				{listing.offer && (
					<p className="discountPrice">
						${listing.regularPrice - listing.discountedPrice}{" "}
						discount
					</p>
				)}

				<ul className="listingDetailsList">
					<li>
						{listing.bedrooms > 1
							? `${listing.bedrooms} Bedrooms`
							: "1 Bedroom"}
					</li>
					<li>
						{listing.bathrooms > 1
							? `${listing.bathrooms} Bathrooms`
							: "1 Bathroom"}
					</li>
					<li>{listing.parking && "Parking Spot"}</li>
					<li>{listing.furnished && "Furnished"}</li>
				</ul>
				<p className="listingLocationTitle">Location</p>

				<div className="leafletContainer">
					{/* The map is centered on the location of the property */}
					<MapContainer
						style={{ height: "100%", width: "100%" }}
						center={[
							listing.geolocation.lat,
							listing.geolocation.lng,
						]}
						zoom={13}
						scrollWheelZoom={true}
					>
						<TileLayer
							// Needed so that we can actually use Leaflet, as we are using the free version it has the watermark
							attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
							url="https://{s}.tile.openstreetmap.de/tiles/osmde/{z}/{x}/{y}.png"
						/>

						{/* Position of the marker */}
						<Marker
							position={[
								listing.geolocation.lat,
								listing.geolocation.lng,
							]}
						>
							{/* The pop up text that comes up when you click the marker */}
							<Popup>{listing.location}</Popup>
						</Marker>
					</MapContainer>
				</div>

				{/* If this isn't the user's own listing then allow the user to contact the Landlord */}
				{auth.currentUser?.uid !== listing.userRef && (
					<Link
						to={`/contact/${listing.userRef}?listingName=${listing.name}`}
						className="primaryButton"
					>
						Contact Landlord
					</Link>
				)}
			</div>
			{/* Page breaks are here so that the navbar doesn't cover up the text on the words */}
			<br />
			<br />
			<br />
			<br />
		</main>
	);
}

export default Listing;
