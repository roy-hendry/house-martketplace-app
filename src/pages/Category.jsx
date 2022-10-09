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
	const [lastFetchedListing, setLastFetchedListing] = useState(null);

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

				// Holds the last visible listing and sets it the value of lastFetchedListing
				const lastVisible = querySnap.docs[querySnap.docs.length - 1];
				setLastFetchedListing(lastVisible);

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

	// Pagination/load more listings
	const onFetchMoreListings = async () => {
		try {
			// Get a reference
			const listingsRef = collection(db, "listings");

			const q = query(
				listingsRef,
				where("type", "==", params.categoryName),
				orderBy("timestamp", "desc"),
				startAfter(lastFetchedListing),
				limit(10)
			);
			// Execute query
			const querySnap = await getDocs(q);

			// Holds the last visible listing and sets it the value of lastFetchedListing
			const lastVisible = querySnap.docs[querySnap.docs.length - 1];
			setLastFetchedListing(lastVisible);

			const listings = [];

			querySnap.forEach((doc) => {
				console.log(doc.data());
				return listings.push({
					id: doc.id,
					data: doc.data(),
				});
			});

			// This will mean that it will add new listings onto the currently being shown listings
			setListings((prevState) => [...prevState, ...listings]);
			setLoading(false);
		} catch (error) {
			toast.error("Could not fetch listings");
		}
	};

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

					<br />
					<br />
					{lastFetchedListing && (
						<p className="loadMore" onClick={onFetchMoreListings}>
							Load more if availible
						</p>
					)}
				</>
			) : (
				<p>No listings for {params.categoryName}</p>
			)}
		</div>
	);
}

export default Category;
