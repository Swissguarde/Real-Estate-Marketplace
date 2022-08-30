import { useNavigate } from "react-router-dom";
import { FaUser, FaCompass, FaTag, FaMoon, FaSun } from "react-icons/fa";

import useDarkMode from "../hooks/useDarkMode";
const Navbar = () => {
  const [colorTheme, setTheme] = useDarkMode();
  const navigate = useNavigate();

  return (
    <div>
      <div className="flex justify-between items-center py-5 mb-5 border-b-[2px] pb-3 border-black dark:border-white">
        <div className="text-xl md:text-3xl">House MarketPlace</div>
        <button
          className={
            colorTheme === "light"
              ? "text-sm md:text-2xl text-lime-400 border-2 border-lime-400 rounded-[50%] flex justify-center items-center p-3 hover:motion-safe:animate-spin"
              : "text-sm md:text-2xl text-blue-900 border-2 border-blue-900 rounded-[50%] flex justify-center items-center p-3 hover:motion-safe:animate-spin"
          }
          onClick={() => setTheme(colorTheme)}
        >
          {colorTheme === "light" ? <FaSun /> : <FaMoon />}
        </button>
      </div>
      <footer className="fixed bg-slate-900 text-white dark:bg-black bottom-0 left-0 right-0 h-[80px] z-[1000] flex items-center justify-center">
        <nav className="w-full mt-3 overflow-y-hidden">
          <ul className="m-0 p-0 flex justify-evenly items-center">
            <li
              onClick={() => navigate("/")}
              className="flex items-center cursor-pointer flex-col"
            >
              <FaCompass size={25} />
              <div className="mt-2 text-xl mb-2">Explore</div>
            </li>
            <li
              onClick={() => navigate("/offers")}
              className="flex items-center cursor-pointer flex-col"
            >
              <FaTag size={25} />
              <div className="mt-2 text-xl mb-2">Offers</div>
            </li>
            <li
              onClick={() => navigate("/profile")}
              className="flex items-center cursor-pointer flex-col"
            >
              <FaUser size={25} />
              <div className="mt-2 text-xl mb-2 ">Profile</div>
            </li>
          </ul>
        </nav>
      </footer>
    </div>
  );
};
export default Navbar;
