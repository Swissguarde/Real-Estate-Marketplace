import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { collection, getDocs, query, orderBy, limit } from "firebase/firestore";
import { db } from "../firebase.config";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import SwiperCore, { Navigation, Pagination, Scrollbar, A11y } from "swiper";
import Spinner from "./Spinner";
SwiperCore.use([Navigation, Pagination, Scrollbar, A11y]);

const Slider = () => {
  const [loading, setLoading] = useState(true);
  const [listings, setListings] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchListings = async () => {
      const listingsRef = collection(db, "listings");
      const q = query(listingsRef, orderBy("timestamp", "desc"), limit(5));
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

  if (listings.length === 0) {
    return <></>;
  }
  return (
    listings && (
      <>
        <Swiper slidesPerView={1} pagination={{ clickable: true }}>
          {listings.map(({ data, id }) => (
            <SwiperSlide
              className="cursor-pointer"
              key={id}
              onClick={() => navigate(`/category/${data.type}/${id}`)}
            >
              <div
                style={{
                  background: `url(${data.imgUrls[0]}) center no-repeat`,
                  backgroundSize: "cover",
                }}
                className="relative w-full h-[200px]"
              >
                <div className="bg-slate-500 p-3 rounded w-fit mt-6">
                  <p>{data.name}</p>
                  <p>
                    ${data.discountedPrice ?? data.regularPrice}{" "}
                    {data.type === "rent" && "/ month"}
                  </p>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </>
    )
  );
};
export default Slider;
