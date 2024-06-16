import {
  Button,
  Input,
  User as NextUIUser,
  Spinner,
  Textarea,
} from "@nextui-org/react";
import { FaArrowLeft } from "react-icons/fa";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { StoreState } from "../interfaces/storeInterface";
import { useRef, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { User } from "../interfaces/common";
import { useUpdateProfileMutation } from "../store/api/api";
import { useAsyncMutation } from "../hooks/hooks";
import { sendImagetoCloud } from "../utils";
import { v4 as uuid } from "uuid";
import DesktopSidebar from "../components/shared/DesktopSidebar";

function EditProfile() {
  const navigate = useNavigate();
  const submitRef = useRef<HTMLButtonElement | null>(null);
  const imageRef = useRef<HTMLInputElement>(null);
  const [image, setImage] = useState<File | null>(null);
  const [loader, setLoader] = useState(false);
  const userData = useSelector((state: StoreState) => state.userSlice.user);

  const [updateProfile] = useAsyncMutation(useUpdateProfileMutation);
  const { register, reset, handleSubmit } = useForm<User>({
    defaultValues: {
      username: userData.username,
      name: userData.name,
      email: userData.email,
      bio: userData.bio,
      avatar: userData.avatar,
    },
  });

  const OnSubmit: SubmitHandler<User> = async (data) => {
    setLoader(true);
    if (image) {
      const imgUrl = await sendImagetoCloud(image, "profile");
      const newAvatar = { public_id: uuid(), url: imgUrl };
      data = { ...data, avatar: newAvatar };
    }
    await updateProfile("Updating", data);
    reset();
    setLoader(false);
    navigate("/profile");
  };

  return (
    <>
      <DesktopSidebar />
      <div className="lg:w-[600px] lg:m-auto lg:py-6">
        <div className="p-4 px-5 flex justify-between items-center border-b lg:border-none">
          <div className="flex items-center space-x-4 lg:space-x-0">
            <Link to={"/profile"} className="lg:hidden">
              <FaArrowLeft />
            </Link>
            <h1 className="font-medium text-3xl">Edit</h1>
          </div>
          <div className="flex justify-center items-center space-x-3">
            <Button
              size="sm"
              color="primary"
              className="text-white"
              onClick={() => submitRef.current?.click()}
            >
              {loader ? <Spinner color="current" size="sm" /> : "Save"}
            </Button>
          </div>
        </div>
        <div className="w-[90%] lg:w-fit p-4 bg-gray-200 rounded-2xl  m-auto my-4">
          <NextUIUser
            name={`${userData?.name}`}
            description={
              <p role="button" onClick={() => imageRef.current?.click()}>
                Change photo
              </p>
            }
            avatarProps={{
              src: `${
                image ? URL.createObjectURL(image) : userData.avatar?.url
              }`,
            }}
            classNames={{
              name: "font-bold text-base",
              description: "text-blue-400 font-bold",
            }}
          />
        </div>
        <form onSubmit={handleSubmit(OnSubmit)}>
          <div className="p-4 flex flex-col space-y-12">
            <Input
              label="Username"
              labelPlacement="outside"
              startContent="@"
              size="lg"
              classNames={{ label: "font-semibold" }}
              {...register("username")}
            />
            <Input
              label="Name"
              labelPlacement="outside"
              size="lg"
              classNames={{ label: "font-semibold" }}
              {...register("name")}
            />
            <Input
              label="Email"
              labelPlacement="outside"
              size="lg"
              classNames={{ label: "font-semibold" }}
              {...register("email")}
            />
            <Textarea
              label="Bio"
              labelPlacement="outside"
              classNames={{ label: "font-semibold" }}
              {...register("bio")}
            />
            <input
              type="file"
              ref={imageRef}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                if (e.target.files && e.target.files.length > 0) {
                  setImage(e.target.files[0]);
                }
              }}
              className="hidden"
            />
            <button type="submit" className="hidden" ref={submitRef}></button>
          </div>
        </form>
      </div>
    </>
  );
}

export default EditProfile;
