import spinnerSvg from "../assets/svg/spinner.svg";

const Spinner = () => {
  return (
    <div className="flex items-center justify-center">
      <img src={spinnerSvg} alt="" />
    </div>
  );
};
export default Spinner;
