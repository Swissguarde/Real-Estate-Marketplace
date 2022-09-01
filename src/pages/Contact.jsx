import { useState, useEffect } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase.config";
import { toast } from "react-toastify";

const Contact = () => {
  const [message, setMessage] = useState("");
  const [landlord, setLandlord] = useState(null);
  // eslint-disable-next-line
  const [searchParams, setSearchParams] = useSearchParams();

  const params = useParams();

  useEffect(() => {
    const getLandlord = async () => {
      const docRef = doc(db, "users", params.landlordId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setLandlord(docSnap.data());
      } else {
        toast.error("Could not get landlord data");
      }
    };
    getLandlord();
  }, [params.landlordId]);

  const onChange = (e) => setMessage(e.target.value);
  return (
    <div>
      <div>
        <div className="text-2xl text-blue-500 text-center">
          Contact Landlord
        </div>
        {landlord !== null && (
          <main>
            <div className="text-sm mt-5 text-gray-600">
              Contact {landlord.name}
            </div>

            <form className="mt-8 md:mt-10 md:max-w-[550px]">
              <div>
                <label htmlFor="message">Message</label>
                <textarea
                  name="message"
                  id="message"
                  value={message}
                  onChange={onChange}
                  className="p-6 w-full h-40 my-2 rounded-lg bg-black/80 text-white dark:bg-black/50"
                ></textarea>
              </div>

              <a
                href={`mailto:${landlord.email}?Subject=${searchParams.get(
                  "listingName"
                )}&body=${message}`}
              >
                <button
                  type="button"
                  className="mt-6 p-2 rounded-lg w-full bg-blue-500"
                >
                  Send Message
                </button>
              </a>
            </form>
          </main>
        )}
      </div>
    </div>
  );
};
export default Contact;
