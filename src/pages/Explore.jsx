import { Link } from "react-router-dom";
import Slider from "../components/Slider";
import "swiper/css";
import "swiper/css/pagination";
import rentCategoryImage from "../assets/jpg/rentCategoryImage.jpg";
import sellCategoryImage from "../assets/jpg/sellCategoryImage.jpg";

function Explore() {
	return (
		<div className="explore">
			<header>
				<p className="pageTitle">Expore</p>
			</header>
			<main>
				<Slider />

				<p className="exploreCategoryHeading">Categories</p>
				<div className="exploreCategories">
					<Link to="/category/rent">
						<img
							className="exploreCategoryImg"
							src={rentCategoryImage}
							alt="rent"
						/>
						<p className="exploreCategoryName">Places for rent</p>
					</Link>
					<Link to="/category/sale">
						<img
							className="exploreCategoryImg"
							src={sellCategoryImage}
							alt="sell"
						/>
						<p className="exploreCategoryName">Places for sale</p>
					</Link>
				</div>
			</main>
			{/* Page breaks are here so that the navbar doesn't cover up the text on the words */}
			<br />
			<br />
			<br />
			<br />
		</div>
	);
}

export default Explore;
