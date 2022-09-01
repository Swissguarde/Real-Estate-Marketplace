import { getAuth } from "firebase/auth";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { updateProfile } from "firebase/auth";
import { db } from "../firebase.config";
import {
  doc,
  updateDoc,
  query,
  collection,
  where,
  orderBy,
  getDocs,
  deleteDoc,
} from "firebase/firestore";
import { toast } from "react-toastify";
import ListingItem from "../components/ListingItem";

const Profile = () => {
  const auth = getAuth();
  const [changeDetails, setChangeDetails] = useState(false);
  const [loading, setLoading] = useState(true);
  const [listings, setListings] = useState(null);
  const [formData, setFormData] = useState({
    name: auth.currentUser.displayName,
    email: auth.currentUser.email,
  });

  const { name, email } = formData;

  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserListings = async () => {
      const listingsRef = collection(db, "listings");
      const q = query(
        listingsRef,
        where("userRef", "==", auth.currentUser.uid),
        orderBy("timestamp", "desc")
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
    };
    fetchUserListings();
  }, [auth.currentUser.uid]);

  const logOut = () => {
    auth.signOut();
    navigate("/sign-in");
  };

  const onChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const onSubmit = async () => {
    try {
      if (auth.currentUser.displayName !== name) {
        await updateProfile(auth.currentUser, {
          displayName: name,
        });
      }
      // Update in db
      const docRef = doc(db, "users", auth.currentUser.uid);
      await updateDoc(docRef, { name });
    } catch (error) {
      toast.error("Unable to update profile");
    }
  };

  const onDelete = async (listingId) => {
    if (window.confirm("Are you sure you want to delete?")) {
      await deleteDoc(doc(db, "listings", listingId));
      const updatedListings = listings.filter(
        (listing) => listing.id !== listingId
      );
      setListings(updatedListings);
      toast.success("Successfully deleted listing");
    }
  };

  const onEdit = (listingId) => navigate(`/edit-listing/${listingId}`);
  return (
    <div className="pb-80">
      <div className="flex justify-between items-center">
        <div className="text-2xl">My Profile</div>
        <button onClick={logOut} className="p-2 md:p-3 rounded-lg bg-red-500">
          Log Out
        </button>
      </div>

      <div className="mt-10">
        <div className="my-5 text-slate-500">Personal Details</div>
        <div
          onClick={() => {
            setChangeDetails(!changeDetails);
            changeDetails && onSubmit();
          }}
          className="float-right text-green-500  cursor-pointer"
        >
          {changeDetails ? "done" : "change"}
        </div>
        <div className="md:max-w-[550px]">
          <input
            type="text"
            className="p-3 w-full my-2 rounded-lg bg-black/80 text-white dark:bg-black/50"
            id="name"
            value={name}
            onChange={onChange}
            disabled={!changeDetails}
          />
          <input
            type="email"
            className="p-3 w-full my-2 rounded-lg bg-black/80 text-white dark:bg-black/50"
            id="email"
            value={email}
            onChange={onChange}
            disabled
          />
        </div>
      </div>

      <div className="my-20">
        <Link to="/create-listing " className="p-4 w-[100%] my-2 bg-blue-500">
          Sell or Rent your home
        </Link>
      </div>

      {!loading && listings?.length > 0 ? (
        <>
          <div className="text-xl text-center text-blue-500 mb-2">
            Your Listings
          </div>
          <p className="text-xs mb-4">Here are all the listings you created</p>
          <ul>
            {listings.map((listing) => (
              <ListingItem
                key={listing.id}
                data={listing.data}
                id={listing.id}
                onDelete={() => onDelete(listing.id)}
                onEdit={() => onEdit(listing.id)}
              />
            ))}
          </ul>
        </>
      ) : (
        <div className="text-center">
          {" "}
          You have no listings. Sell or Rent your property to create a listing
        </div>
      )}
    </div>
  );
};
export default Profile;
