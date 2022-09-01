import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { getAuth } from "firebase/auth";
import { getDoc, doc } from "firebase/firestore";
import { db } from "../firebase.config";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import SwiperCore, { Navigation, Pagination, Scrollbar, A11y } from "swiper";
import Spinner from "../components/Spinner";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import { FaShare } from "react-icons/fa";
SwiperCore.use([Navigation, Pagination, Scrollbar, A11y]);

const Listing = () => {
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [shareLinkCopied, setShareLinkCopied] = useState(false);
  const auth = getAuth();
  const params = useParams();

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
  }, [params.listingId]);

  if (loading) {
    return <Spinner />;
  }

  return (
    <div className="pb-40">
      <main className="mb-8 relative">
        <Swiper slidesPerView={1} pagination={{ clickable: true }}>
          {listing.imgUrls.map((url, i) => (
            <SwiperSlide className="h-full" key={i}>
              <img
                src={listing.imgUrls[i]}
                className="w-full h-[500px] object-cover"
                alt=""
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </main>
      <div className="flex items-center justify-between">
        <div className="text-2xl mb-2">{listing.name}</div>
        <div className="text-green-500">
          $
          {listing.offer
            ? listing.discountedPrice
                .toString()
                .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
            : listing.regularPrice
                .toString()
                .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
        </div>
      </div>
      <div className="absolute top-40 right-8 p-2 z-[100] bg-black text-white dark:bg-white dark:text-black rounded-[50%]">
        <FaShare
          onClick={() => {
            navigator.clipboard.writeText(window.location.href);
            setShareLinkCopied(true);
            setTimeout(() => {
              setShareLinkCopied(false);
            }, 2000);
          }}
          className="cursor-pointer"
          size={30}
        />
      </div>
      <>
        {shareLinkCopied && (
          <p className="absolute top-60 z-[100] rounded-lg p-2 right-8 bg-teal-400">
            Link Copied!
          </p>
        )}
      </>

      <div className="mb-2 text-sm">
        Location: <span className="text-gray-600">{listing.location}</span>
      </div>
      <div className="flex items-center justify-between md:max-w-[200px]">
        <div className="bg-green-500 text-sm p-1 rounded-md w-fit">
          For {listing.type === "rent" ? "Rent" : "Sale"}
        </div>
        {listing.offer && (
          <p className="bg-black text-white dark:bg-white dark:text-black rounded-r-lg p-1">
            ${listing.regularPrice - listing.discountedPrice} discount
          </p>
        )}
      </div>

      <div className="my-6">
        <ul>
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
      </div>

      <div>
        <div className="text-xl text-center md:mt-8 mb-6">Location on map</div>

        <div className="w-full h-[400px]">
          <MapContainer
            style={{ height: "100%", width: "100%" }}
            center={[listing.geolocation.lat, listing.geolocation.lng]}
            zoom={13}
            scrollWheelZoom={false}
          >
            <TileLayer
              attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.de/tiles/osmde/{z}/{x}/{y}.png"
            />

            <Marker
              position={[listing.geolocation.lat, listing.geolocation.lng]}
            >
              <Popup>{listing.location}</Popup>
            </Marker>
          </MapContainer>
        </div>
      </div>

      {auth.currentUser?.uid !== listing.userRef && (
        <div className="my-8 flex items-center justify-center w-full">
          <Link
            to={`/contact/${listing.userRef}?listingName=${listing.name}`}
            className="mt-6 p-2 rounded-lg bg-blue-500"
          >
            Contact Landlord
          </Link>
        </div>
      )}
    </div>
  );
};
export default Listing;
