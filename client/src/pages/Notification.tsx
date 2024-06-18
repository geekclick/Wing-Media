import { FaArrowLeft } from "react-icons/fa";
import { MdDeleteSweep } from "react-icons/md";
import { PiDotsThreeOutlineVertical } from "react-icons/pi";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { StoreState } from "../interfaces/storeInterface";
import { Avatar, Button, Card, CardBody, Spinner } from "@nextui-org/react";
import {
  useGetNotificationsQuery,
  useManageRequestMutation,
} from "../store/api/api";
import { useEffect } from "react";
import {
  decrementNotifications,
  setNotification,
} from "../store/reducers/userSlice";
import { useAsyncMutation } from "../hooks/hooks";
import DesktopSidebar from "../components/shared/DesktopSidebar";

function Notification() {
  const dispatch = useDispatch();
  const { isLoading, data, refetch } = useGetNotificationsQuery();
  const notificaions =
    useSelector((state: StoreState) => state.userSlice.notifications) || [];

  const [manageRequest] = useAsyncMutation(useManageRequestMutation);
  const fetchNotifications = async () => {
    await refetch();
    dispatch(setNotification(data?.data));
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  return isLoading && notificaions?.length == 0 ? (
    <Spinner className="w-full h-screen" size="lg" />
  ) : (
    <div className="h-screen">
      <DesktopSidebar />
      <div className="lg:w-[600px] lg:m-auto lg:py-6">
        <div className="p-4 px-5 flex justify-between items-center">
          <div className="flex items-center space-x-4 lg:space-x-0">
            <Link to={"/"} className="lg:hidden">
              <FaArrowLeft />
            </Link>
            <h1 className="font-medium text-2xl">Notifications </h1>
          </div>
          <div className="flex justify-center items-center space-x-3">
            <MdDeleteSweep className="text-3xl" />
            <PiDotsThreeOutlineVertical className="text-2xl" />
          </div>
        </div>
        {notificaions?.length == 0 ? (
          <div className="w-full h-[60vh] flex justify-center">
            <h1 className="text-center m-auto text-lg">No notificaions now!</h1>
          </div>
        ) : (
          notificaions?.map((not) => {
            return (
              <div className="p-4" key={not?._id}>
                <Card>
                  <CardBody>
                    <div className="flex justify-between items-center">
                      <div className="flex justify-start items-center space-x-2">
                        <Avatar src={not.sender.avatar} showFallback />
                        <div>
                          <h1 className="font-bold text-sm">
                            {not.sender.name}
                          </h1>
                          <p className="text-[11px]">Sent you follow request</p>
                        </div>
                      </div>
                      <div className="flex justify-center items-center">
                        <Button
                          className="text-danger"
                          size="sm"
                          variant="light"
                          onClick={async () => {
                            if (not?._id)
                              await manageRequest("Request Accepting", {
                                requestId: not?._id,
                                accept: false,
                              });
                            refetch();
                          }}
                        >
                          Reject
                        </Button>
                        <Button
                          className="text-white text-xs"
                          variant="solid"
                          color="primary"
                          size="sm"
                          onClick={async () => {
                            if (not?._id)
                              await manageRequest("Request Accepting", {
                                requestId: not?._id,
                                accept: true,
                              });
                            dispatch(decrementNotifications());
                            refetch();
                          }}
                        >
                          Follow Back
                        </Button>
                      </div>
                    </div>
                  </CardBody>
                </Card>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

export default Notification;
