import sellCategoryImage from "../assets/jpg/exterior.jpg";
import rentCategoryImage from "../assets/jpg/exterior2.jpg";
import { Link } from "react-router-dom";
import Slider from "../components/Slider";

const Explore = () => {
  return (
    <>
      <div className="text-2xl text-blue-500">Explore latest listings</div>
      <Slider />
      <div className="mt-10 grid grid-cols-1 md:grid-cols-2 justify-between gap-6">
        <Link to="/category/sale" className="w-full">
          <img
            className="h-[20vh] md:h-[45vh] w-[100%] rounded-lg object-cover my-0 mx-auto"
            src={sellCategoryImage}
            alt=""
          />
          <p className="mt-3">Places for Sale</p>
        </Link>

        <Link to="/category/rent" className="w-full">
          <img
            className="h-[20vh] md:h-[45vh] w-[100%] rounded-lg object-cover my-0 mx-auto"
            src={rentCategoryImage}
            alt=""
          />
          <p className="mt-3">Places for Rent</p>
        </Link>
      </div>
    </>
  );
};
export default Explore;
