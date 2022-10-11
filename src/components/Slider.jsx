import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { collection, getDocs, query, orderBy, limit } from "firebase/firestore";
import { db } from "../firebase.config";
import SwiperCore, { Navigation, Pagination, Scrollbar, A11y } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import Spinner from "./Spinner";
SwiperCore.use([Navigation, Pagination, Scrollbar, A11y]);

// The set up of this component will be very useful for future projects so refer back to it if need be

function Slider() {
	const [loading, setLoading] = useState(true);
	const [listings, setListings] = useState(null);

	const navigate = useNavigate();

	// We only want the first 5 listings and they get pushed onto the listings array individually as we can't really map through like we did for the other examples of taking data from firebase
	useEffect(() => {
		const fetchListings = async () => {
			const listingsRef = collection(db, "listings");
			const q = query(
				listingsRef,
				orderBy("timestamp", "desc"),
				limit(5)
			);
			const querySnap = await getDocs(q);

			let listings = [];

			querySnap.forEach((doc) => {
				return listings.push({
					id: doc.id,
					data: doc.data(),
				});
			});

			setListings(listings);
			setLoading(false);
		};

		fetchListings();
	}, []);

	if (loading) {
		return <Spinner />;
	}

	// This stops us from having a big empty space if there is no listing shown
	if (listings.length === 0) {
		return <></>;
	}

	return (
		listings && (
			<>
				<p className="exploreHeading">Recommended</p>

				<Swiper spaceBetween={50} slidesPerView={1}>
					{listings.map(({ data, id }) => (
						<SwiperSlide
							key={id}
							onClick={() =>
								navigate(`/category/${data.type}/${id}`)
							}
						>
							<div className="swiperSlideDiv">
								<img
									className="swiperSlideImgSmaller"
									src={data.imgUrls[0]}
									alt="Images of the house"
								/>
								<p className="swiperSlideText">{data.name}</p>
								<p className="swiperSlidePrice">
									${data.discountedPrice ?? data.regularPrice}{" "}
									{data.type === "rent" && "/ month"}
								</p>
							</div>
						</SwiperSlide>
					))}
				</Swiper>
			</>
		)
	);
}

export default Slider;
