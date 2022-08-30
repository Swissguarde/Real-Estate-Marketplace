import { useState, useEffect } from "react";
import {
  collection,
  getDocs,
  where,
  orderBy,
  limit,
  query,
} from "firebase/firestore";
import { db } from "../firebase.config";
import { toast } from "react-toastify";
import Spinner from "../components/Spinner";
import ListingItem from "../components/ListingItem";
const Offers = () => {
  const [loading, setLoading] = useState(true);
  const [listings, setListings] = useState(null);
  useEffect(() => {
    const fetchOffers = async () => {
      try {
        const listingsRef = collection(db, "listings");
        const q = query(
          listingsRef,
          where("offer", "==", true),
          orderBy("timestamp", "desc"),
          limit(10)
        );
        const querySnap = await getDocs(q);
        let listings = [];
        querySnap.forEach((doc) => {
          listings.push({
            id: doc.id,
            data: doc.data(),
          });
        });
        setListings(listings);
        setLoading(false);
      } catch (error) {
        toast.error("Could not fetch offers");
      }
    };
    fetchOffers();
  }, []);
  return (
    <div>
      <div className="text-2xl text-blue-500">Offers</div>
      <div className="mt-10">
        {loading ? (
          <Spinner />
        ) : (
          listings &&
          listings.length > 0 && (
            <>
              {listings.map((listing) => (
                <>
                  <ListingItem
                    data={listing.data}
                    key={listing.id}
                    id={listing.id}
                  />
                </>
              ))}
            </>
          )
        )}
      </div>
    </div>
  );
};
export default Offers;
