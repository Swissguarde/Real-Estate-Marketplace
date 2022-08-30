import { FaBed, FaToilet, FaTrash } from "react-icons/fa";
import { Link } from "react-router-dom";
const ListingItem = ({ id, data, onDelete }) => {
  return (
    <Link
      to={`/category/${data.type}/${id}`}
      className="grid grid-cols-2 mb-6 gap-3 md:gap-8 justify-between items-center w-full"
    >
      <img
        className="h-[20vh] md:h-[45vh] w-[100%] rounded-lg object-cover my-0 mx-auto"
        src={data.imgUrls[0]}
        alt={data.name}
      />

      <div>
        <div className="text-[8px] text-gray-500 md:text-2xl">
          {data.location}
        </div>
        <div className="text-sm md:text-2xl">{data.name}</div>
        <div className="bg-green-500 h-fit w-fit my-2 p-1 rounded">
          $
          {data.offer
            ? data.discountedPrice
                .toString()
                .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
            : data.regularPrice
                .toString()
                .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
          {data.type === "rent" && " / Month"}
        </div>
        <div className="flex flex-wrap gap-2">
          <div className="flex items-center text-xs">
            <FaBed className="mr-1 text-green-500" />
            {data.bedrooms > 1 ? `${data.bedrooms} Bedrooms` : "1 Bedroom"}
          </div>
          <div className="flex items-center text-xs">
            <FaToilet className="mr-1 text-green-500" />
            {data.bathrooms > 1 ? `${data.bathrooms} Bathrooms` : "1 Bathrooms"}
          </div>
        </div>
      </div>

      {onDelete && <FaTrash onClick={() => onDelete(data.id, data.name)} />}
    </Link>
  );
};
export default ListingItem;
