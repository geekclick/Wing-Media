import {
  AvatarIcon,
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
import DesktopSidebar from "../components/shared/DesktopSidebar";
import { useFileHandler } from "6pp";
import { MdDeleteForever } from "react-icons/md";
import AlertModal from "../components/profile/AlertModal";

function EditProfile() {
  const navigate = useNavigate();
  const submitRef = useRef<HTMLButtonElement | null>(null);
  const imageRef = useRef<HTMLInputElement>(null);
  const image = useFileHandler("single");
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
    const formData = new FormData();
    if (image.file) {
      formData.append("single", image.file);
    }
    formData.append("data", JSON.stringify(data));

    await updateProfile("Updating", { data: formData });
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
              src: `${image.preview ? image.preview : userData.avatar?.url}`,
              showFallback: true,
              fallback: <AvatarIcon />,
              classNames: { fallback: "w-full" },
            }}
            classNames={{
              name: "font-bold text-base",
              description: "text-blue-400 font-bold",
            }}
          />
        </div>
        <form onSubmit={handleSubmit(OnSubmit)}>
          <div className="p-4 flex flex-col space-y-14">
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
              onChange={image.changeHandler}
              className="hidden"
            />
            <button type="submit" className="hidden" ref={submitRef}></button>
          </div>
        </form>
        <AlertModal>
          <button className="flex w-fit m-auto my-4 p-3 font-semibold text-white rounded-lg bg-red-500">
            <MdDeleteForever className="text-2xl" />
            <span>Delete Account Permanently</span>
          </button>
        </AlertModal>
      </div>
    </>
  );
}

export default EditProfile;
