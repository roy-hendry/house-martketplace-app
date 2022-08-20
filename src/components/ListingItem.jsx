import { Link } from "react-router-dom";
import { ReactComponent as DeleteIcon } from "../assets/svg/deleteIcon.svg";
import bedIcon from "../assets/svg/bedIcon.svg";
import bathtubIcon from "../assets/svg/bathtubIcon.svg";

function ListingItem({ listing, id, onDelete }) {
	return (
		<li className="categoryListing">
			<Link
				className="categoryListingLink"
				to={`/category/${listing.type}/${id}`}
			>
				<img
					className="categoryListingImg"
					src={listing.imgUrls[0]}
					alt={listing.name}
				/>
				<div className="categoryListingDetails">
					<p className="categoryListingLocation">
						{listing.location}
					</p>
					<p className="categoryListingName">{listing.name}</p>
					<p className="categoryListingPrice">
						{/* Shows discounted or regular price based on if the property is on offer
                        The regex is used just so that a comma will be in the price every 3 digits from the right */}
						$
						{listing.offer
							? listing.discountedPrice
									.toString()
									.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
							: listing.regularPrice
									.toString()
									.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
						{/* If the type is rent then we want to display that the price is per month */}
						{listing.type === "rent" && " / Month"}
					</p>
					<div className="categoryListingInfoDiv">
						<img src={bedIcon} alt="bed" />
						<p className="categoryListingInfoText">
							{listing.bedrooms > 1
								? `${listing.bedrooms} Bedrooms`
								: "1 Bedroom"}
						</p>
						<img src={bathtubIcon} alt="bath" />
						<p className="categoryListingInfoText">
							{listing.bathrooms > 1
								? `${listing.bathrooms} Bathrooms`
								: "1 Bathroom"}
						</p>
					</div>
				</div>
			</Link>
			{onDelete && (
				<DeleteIcon
					className="removeIcon"
					fill="rgb(231,76,60)"
					onClick={() => {
						onDelete(listing.id, listing.name);
					}}
				/>
			)}
		</li>
	);
}

export default ListingItem;
