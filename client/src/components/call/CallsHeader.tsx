import { FaArrowLeft } from "react-icons/fa";
import { MdOutlineAddIcCall } from "react-icons/md";
import { PiDotsThreeOutlineVertical } from "react-icons/pi";
import { Link } from "react-router-dom";

function CallsHeader() {
  return (
    <div>
      <div className="p-4 px-5 flex justify-between items-center">
        <div className="flex items-center space-x-4 lg:space-x-0">
          <Link to={"/"} className="lg:hidden">
            <FaArrowLeft />
          </Link>
          <h1 className="font-medium text-3xl">Calls</h1>
        </div>
        <div className="flex justify-center items-center space-x-3">
          <MdOutlineAddIcCall className="text-2xl" />
          <PiDotsThreeOutlineVertical className="text-2xl" />
        </div>
      </div>
    </div>
  );
}

export default CallsHeader;
