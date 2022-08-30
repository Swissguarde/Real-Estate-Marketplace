import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  collection,
  where,
  orderBy,
  getDocs,
  query,
  limit,
} from "firebase/firestore";
import { db } from "../firebase.config";
import { toast } from "react-toastify";
import Spinner from "../components/Spinner";
import ListingItem from "../components/ListingItem";

const Category = () => {
  const [listings, setListings] = useState(null);
  const [loading, setLoading] = useState(true);
  const params = useParams();

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const listingsRef = collection(db, "listings");
        const q = query(
          listingsRef,
          where("type", "==", params.catgeoryName),
          orderBy("timestamp", "desc"),
          limit(10)
        );
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
      } catch (error) {
        toast.error("Could not fetch listings");
      }
    };
    fetchListings();
  }, [params.catgeoryName]);

  return (
    <div>
      <div className="text-2xl text-blue-500">
        Places for {params.catgeoryName}
      </div>

      <div className="mt-10">
        {loading ? (
          <Spinner />
        ) : listings && listings.length > 0 ? (
          <div>
            {listings.map((listing) => (
              <ListingItem
                data={listing.data}
                key={listing.id}
                id={listing.id}
              />
            ))}
          </div>
        ) : (
          "No listings available"
        )}
      </div>
    </div>
  );
};
export default Category;
