import { useState, useEffect, useRef } from "react";
import { onAuthStateChanged, getAuth } from "firebase/auth";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import { serverTimestamp, doc, updateDoc, getDoc } from "firebase/firestore";
import { db } from "../firebase.config";
import Spinner from "../components/Spinner";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { nanoid } from "nanoid";
const EditListing = () => {
  const [loading, setLoading] = useState(false);
  const [listing, setListing] = useState(false);
  // eslint-disable-next-line
  const [useGeoLocation, setUseGeoLocation] = useState(true);
  const [formData, setFormData] = useState({
    type: "rent",
    name: "",
    bedrooms: 1,
    bathrooms: 1,
    parking: false,
    furnished: false,
    address: "",
    offer: false,
    regularPrice: 0,
    discountedPrice: 0,
    images: {},
    latitude: 0,
    longitude: 0,
  });

  const {
    type,
    name,
    bedrooms,
    bathrooms,
    parking,
    furnished,
    address,
    offer,
    regularPrice,
    discountedPrice,
    images,
    latitude,
    longitude,
  } = formData;

  const auth = getAuth();
  const navigate = useNavigate();
  const params = useParams();
  const isMounted = useRef(true);

  useEffect(() => {
    if (isMounted) {
      onAuthStateChanged(auth, (user) => {
        if (user) {
          setFormData({ ...formData, userRef: user.uid });
        } else {
          navigate("/sign-in");
        }
      });
    }
    return () => {
      isMounted.current = false;
    };
  }, [isMounted]);

  useEffect(() => {
    if (listing && listing.userRef !== auth.currentUser.uid) {
      toast.error("You cannot edit this listing");
      navigate("/");
    }
  }, [auth.currentUser.uid, listing, navigate]);

  useEffect(() => {
    setLoading(true);
    const fetchListing = async () => {
      const docRef = doc(db, "listings", params.listingId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setListing(docSnap.data());
        setFormData({ ...docSnap.data(), address: docSnap.data().location });
        setLoading(false);
      } else {
        navigate("/");
        toast.error("Listing does not exist");
      }
    };

    fetchListing();
  }, [params.listingId, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (discountedPrice >= regularPrice) {
      setLoading(false);
      toast.error("Regular price should be higher than discount price");
      return;
    }
    if (images.length > 6) {
      setLoading(false);
      toast.error("Max 6 images");
    }
    let geolocation = {};
    let location;

    if (useGeoLocation) {
      const options = {
        method: "GET",
        headers: {
          "X-RapidAPI-Key": `${import.meta.env.VITE_RAPID_API_KEY}`,
          "X-RapidAPI-Host":
            "address-from-to-latitude-longitude.p.rapidapi.com",
        },
      };
      const response = await fetch(
        `https://address-from-to-latitude-longitude.p.rapidapi.com/geolocationapi?address=${address}`,
        options
      );
      const data = await response.json();
      geolocation.lat = data.Results[0]?.latitude ?? 0;
      geolocation.lng = data.Results[0]?.longitude ?? 0;
      location =
        data.Results[0]?.length === 0 ? undefined : data.Results[0]?.address;

      if (location === undefined || location.includes("undefined")) {
        setLoading(false);
        toast.error("Please enter a valid address");
        return;
      }
    } else {
      geolocation.lat = latitude;
      geolocation.lng = longitude;
      location = address;
    }

    // Store image in firebase
    const storeImage = async (image) => {
      return new Promise((resolve, reject) => {
        const storage = getStorage();
        const fileName = `${auth.currentUser.uid}-${image.name}-${nanoid()}`;
        const storageRef = ref(storage, "images/" + fileName);
        const uploadTask = uploadBytesResumable(storageRef, image);
        uploadTask.on(
          "state_changed",
          (snapshot) => {
            // Observe state change events such as progress, pause, and resume
            // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
            // eslint-disable-next-line
            const progress =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            switch (snapshot.state) {
              case "paused":
                break;
              case "running":
                break;
              default:
                break;
            }
          },
          (error) => {
            // Handle unsuccessful uploads
            reject(error);
          },
          () => {
            // Handle successful uploads on complete
            // For instance, get the download URL: https://firebasestorage.googleapis.com/...
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
              resolve(downloadURL);
            });
          }
        );
      });
    };

    const imgUrls = await Promise.all(
      [...images].map((image) => storeImage(image))
    ).catch(() => {
      setLoading(false);
      toast.error("Images not uploaded");
      return;
    });

    const formDataCopy = {
      ...formData,
      timestamp: serverTimestamp(),
      geolocation,
      imgUrls,
    };
    formDataCopy.location = location;
    delete formDataCopy.images;
    delete formDataCopy.address;
    !formDataCopy.offer && delete formDataCopy.discountedPrice;

    const docRef = doc(db, "listings", params.listingId);
    await updateDoc(docRef, formDataCopy);
    setLoading(false);
    toast.success("Listing updated");
    navigate(`/category/${formDataCopy.type}/${docRef.id}`);
  };

  const onAction = (e) => {
    let boolean = null;
    if (e.target.value === "true") {
      boolean = true;
    }
    if (e.target.value === "false") {
      boolean = false;
    }
    if (e.target.files) {
      setFormData((prev) => ({
        ...prev,
        images: e.target.files,
      }));
    }
    if (!e.target.files) {
      setFormData((prev) => ({
        ...prev,
        [e.target.id]: boolean ?? e.target.value,
      }));
    }
  };
  if (loading) {
    return <Spinner />;
  }

  return (
    <div>
      <div className="text-2xl text-blue-500">Edit listing</div>

      <form onSubmit={handleSubmit} className="mt-10 md:max-w-[550px] pb-64">
        <label>Sell / Rent</label>
        <div className="flex flex-1 gap-3 max-w-[200px] mb-4">
          <button
            type="button"
            className={
              type === "sale"
                ? "p-2 my-2 bg-blue-500 flex-1"
                : "p-2 my-2 dark:bg-white text-black flex-1"
            }
            id="type"
            value="sale"
            onClick={onAction}
          >
            Sell
          </button>
          <button
            type="button"
            className={
              type === "rent"
                ? "p-2 my-2 bg-blue-500 flex-1"
                : "p-2 my-2 dark:bg-white text-black flex-1"
            }
            id="type"
            value="rent"
            onClick={onAction}
          >
            Rent
          </button>
        </div>

        <label>Name of property</label>
        <div>
          <input
            className="p-3 w-full my-2 rounded-lg bg-black/80 text-white dark:bg-black/50"
            type="text"
            value={name}
            onChange={onAction}
            id="name"
            maxLength="32"
            minLength="10"
            required
          />
        </div>

        <div className="flex gap-3">
          <div>
            <label>Bedrooms</label>

            <div>
              <input
                className="p-3 text-center my-2 rounded-lg bg-black/80 text-white dark:bg-black/50"
                type="number"
                value={bedrooms}
                onChange={onAction}
                id="bedrooms"
                min="1"
                max="50"
                required
              />
            </div>
          </div>
          <div>
            <label>Bathrooms</label>
            <div>
              <input
                className="p-3 text-center my-2 rounded-lg bg-black/80 text-white dark:bg-black/50"
                type="number"
                value={bathrooms}
                onChange={onAction}
                id="bathrooms"
                min="1"
                max="50"
                required
              />
            </div>
          </div>
        </div>

        <label>Parking</label>
        <div className="flex flex-1 gap-3 max-w-[200px] mb-4">
          <button
            type="button"
            className={
              parking
                ? "p-2 my-2 bg-blue-500 flex-1"
                : "p-2 my-2 dark:bg-white text-black flex-1"
            }
            id="parking"
            value={true}
            onClick={onAction}
          >
            Yes
          </button>
          <button
            type="button"
            className={
              !parking && parking !== null
                ? "p-2 my-2 bg-blue-500 flex-1"
                : "p-2 my-2 dark:bg-white text-black flex-1"
            }
            id="parking"
            value={false}
            onClick={onAction}
          >
            No
          </button>
        </div>

        <label>Furnished</label>
        <div className="flex flex-1 gap-3 max-w-[200px] mb-4">
          <button
            type="button"
            className={
              furnished
                ? "p-2 my-2 bg-blue-500 flex-1"
                : "p-2 my-2 dark:bg-white text-black flex-1"
            }
            id="furnished"
            value={true}
            onClick={onAction}
          >
            Yes
          </button>
          <button
            type="button"
            className={
              !furnished && furnished !== null
                ? "p-2 my-2 bg-blue-500 flex-1"
                : "p-2 my-2 dark:bg-white text-black flex-1"
            }
            id="furnished"
            value={false}
            onClick={onAction}
          >
            No
          </button>
        </div>

        <label>Address</label>
        <div>
          <input
            className="p-3 w-full my-2 rounded-lg bg-black/80 text-white dark:bg-black/50"
            type="text"
            value={address}
            onChange={onAction}
            id="address"
            required
          />
        </div>

        {!useGeoLocation && (
          <div className="flex-col gap-3">
            <div>
              <label>Longitude</label>
              <div>
                <input
                  className="p-3 text-center my-2 rounded-lg bg-black/80 text-white dark:bg-black/50"
                  type="number"
                  value={longitude}
                  onChange={onAction}
                  id="longitude"
                  required
                />
              </div>
            </div>
            <div>
              <label>Latitude</label>
              <div>
                <input
                  className="p-3 text-center my-2 rounded-lg bg-black/80 text-white dark:bg-black/50"
                  type="number"
                  value={latitude}
                  onChange={onAction}
                  id="latitude"
                  required
                />
              </div>
            </div>
          </div>
        )}

        <label>Offer</label>
        <div className="flex flex-1 gap-3 max-w-[200px] mb-4">
          <button
            type="button"
            className={
              offer
                ? "p-2 my-2 bg-blue-500 flex-1"
                : "p-2 my-2 dark:bg-white text-black flex-1"
            }
            id="offer"
            value={true}
            onClick={onAction}
          >
            Yes
          </button>
          <button
            type="button"
            className={
              !offer && offer !== null
                ? "p-2 my-2 bg-blue-500 flex-1"
                : "p-2 my-2 dark:bg-white text-black flex-1"
            }
            id="offer"
            value={false}
            onClick={onAction}
          >
            No
          </button>
        </div>

        <label>Regular Price</label>
        <div className="flex items-center gap-3">
          <input
            className="p-3 text-center my-2 rounded-lg bg-black/80 text-white dark:bg-black/50"
            type="number"
            value={regularPrice}
            onChange={onAction}
            id="regularPrice"
            min="50"
            max="750000000"
            required
          />
          {type === "rent" && <p className="text-green-500">$/ Month</p>}
        </div>

        {offer && (
          <>
            <label>Discounted Price</label>
            <div>
              <input
                className="p-3 text-center my-2 rounded-lg bg-black/80 text-white dark:bg-black/50"
                type="number"
                value={discountedPrice}
                onChange={onAction}
                id="discountedPrice"
                min="50"
                max="750000000"
                required={offer}
              />
            </div>
          </>
        )}

        <label>Images</label>
        <div>
          <input
            className="p-3 w-[90%] md:w-[100%] text-center my-2 rounded-lg bg-black/80 text-white dark:bg-black/50"
            type="file"
            id="images"
            onChange={onAction}
            max="6"
            accept=".jpg,.png,.jpeg"
            multiple
            required
          />
        </div>

        <button
          type="submit"
          className="mt-6 p-2 rounded-lg w-full bg-blue-500"
        >
          Edit Listing
        </button>
      </form>
    </div>
  );
};
export default EditListing;
