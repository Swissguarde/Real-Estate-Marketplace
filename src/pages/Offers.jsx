import { useState, useEffect } from "react";
import {
  collection,
  getDocs,
  where,
  orderBy,
  limit,
  startAfter,
  query,
} from "firebase/firestore";
import { db } from "../firebase.config";
import { toast } from "react-toastify";
import Spinner from "../components/Spinner";
import ListingItem from "../components/ListingItem";
const Offers = () => {
  const [loading, setLoading] = useState(true);
  const [listings, setListings] = useState(null);
  const [lastListing, setLastListing] = useState(null);

  useEffect(() => {
    const fetchOffers = async () => {
      try {
        const listingsRef = collection(db, "listings");
        const q = query(
          listingsRef,
          where("offer", "==", true),
          orderBy("timestamp", "desc"),
          limit(4)
        );
        const querySnap = await getDocs(q);
        const lastDoc = querySnap.docs[querySnap.docs.length - 1];
        setLastListing(lastDoc);
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

  const fetchMoreListings = async () => {
    try {
      const listingsRef = collection(db, "listings");
      const q = query(
        listingsRef,
        where("offer", "==", true),
        orderBy("timestamp", "desc"),
        startAfter(lastListing),
        limit(10)
      );
      const querySnap = await getDocs(q);
      const lastDoc = querySnap.docs[querySnap.docs.length - 1];

      setLastListing(lastDoc);
      let listings = [];
      querySnap.forEach((doc) => {
        return listings.push({
          id: doc.id,
          data: doc.data(),
        });
      });
      setListings((prev) => [...prev, ...listings]);
      setLoading(false);
    } catch (error) {
      toast.error("Could not fetch listings");
    }
  };
  return (
    <div className="pb-24">
      <div className="text-2xl text-blue-500">Offers</div>
      <div className="mt-10">
        {loading ? (
          <Spinner />
        ) : (
          listings &&
          listings.length > 0 && (
            <>
              {listings.map((listing) => (
                <ListingItem
                  data={listing.data}
                  key={listing.id}
                  id={listing.id}
                />
              ))}
            </>
          )
        )}
      </div>

      {lastListing && (
        <div className="flex mt-12 items-center justify-center">
          <p
            className="bg-green-500 w-fit p-2 cursor-pointer "
            onClick={fetchMoreListings}
          >
            Load More
          </p>
        </div>
      )}
    </div>
  );
};
export default Offers;
