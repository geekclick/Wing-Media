import { useDeleteProfileMutation } from "../store/api/api";
import { SERVER_URL } from "../constants";
import axios from "axios";
import { useEffect } from "react";
import { User } from "../interfaces/common";

const useHandleGuest = () => {
  const [deleteProfile] = useDeleteProfileMutation();

  const getGuestUsers = async () => {
    try {
      const res = await axios.get<{ data: User[] }>(
        `${SERVER_URL}/api/auth/guests`
      );

      const guests = res.data.data;
      const currentDate: Date = new Date();

      guests.forEach((guest: User) => {
        if (guest.created_at) {
          const createdAt: Date = new Date(guest.created_at);
          const timeDifference: number =
            currentDate.getTime() - createdAt.getTime();
          const hoursDifference: number = timeDifference / (1000 * 60 * 60);
          if (hoursDifference > 1) {
            guest._id && deleteGuest(guest._id);
          }
        }
      });
    } catch (error) {
      console.log(error);
    }
  };

  const deleteGuest = async (_id: string) => {
    try {
      await deleteProfile({ data: _id });
      sessionStorage.removeItem("token");
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getGuestUsers();
  }, []);

  return null;
};

export default useHandleGuest;
