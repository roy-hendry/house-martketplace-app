import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
	collection,
	getDocs,
	query,
	where,
	orderBy,
	limit,
	startAfter,
} from "firebase/firestore";
import { db } from "../firebase.config";
import { toast } from "react-toastify";
import Spinner from "../components/Spinner";
import ListingItem from "../components/ListingItem";

function Category() {
	const [listings, setListings] = useState(null);
	const [loading, setLoading] = useState(true);

	const params = useParams();

	useEffect(() => {
		const fetchListings = async () => {
			try {
				// Get a reference
				const listingsRef = collection(db, "listings");

				// Create a query
				// This is how we make the user get directed to different pages when they click on the images in the Explore page. They will get sent to either category/rent or category/sell depending on the value of categoryName
				const q = query(
					listingsRef,
					where("type", "==", params.categoryName),
					orderBy("timestamp", "desc"),
					limit(10)
				);
				// Execute query
				const querySnap = await getDocs(q);

				const listings = [];

				querySnap.forEach((doc) => {
					console.log(doc.data());
					return listings.push({
						id: doc.id,
						data: doc.data(),
					});
				});

				setListings(listings);
				setLoading(false);
			} catch (error) {
				toast.error("Could not fetch listings");
			}
		};
		fetchListings();
	}, [params.categoryName]);

	return (
		<div className="category">
			<header className="pageTitle">
				<p className="header">
					Places for{" "}
					{params.categoryName === "rent" ? "Rent" : "Sale"}
				</p>
			</header>
			{loading ? (
				<Spinner />
			) : listings && listings.length > 0 ? (
				<>
					<main>
						<ul className="categoryListings">
							{listings.map((listing) => (
								// <h3 key={listing.id}>{listing.data.name}</h3>
								<ListingItem
									listing={listing.data}
									id={listing.id}
									key={listing.id}
								/>
							))}
						</ul>
					</main>
				</>
			) : (
				<p>No listings for {params.categoryName}</p>
			)}
		</div>
	);
}

export default Category;
