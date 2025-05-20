import { Link } from "react-router-dom";

function Button({ whereto, buttonName }) {
  return (
    <div>
      <Link
        to={whereto}
        className="bg-yellow-400 hover:bg-yellow-500 text-slate-900 font-bold py-3 px-6 rounded-full text-lg transition duration-200"
      >
        {buttonName}
      </Link>
    </div>
  );
}

export default Button;
