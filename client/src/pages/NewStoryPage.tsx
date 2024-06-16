import { useFileHandler } from "6pp";
import {
  Avatar,
  Chip,
  Dropdown,
  DropdownItem,
  DropdownTrigger,
  Input,
  DropdownMenu,
} from "@nextui-org/react";
import { useEffect, useRef, useState } from "react";
import { BiEdit, BiPlusCircle, BiSend } from "react-icons/bi";
import { useAsyncMutation } from "../hooks/hooks";
import { useAddStoryMutation } from "../store/api/api";
import toast from "react-hot-toast";
import { ChromePicker } from "react-color";
import Draggable from "react-draggable";
import { Link, useNavigate } from "react-router-dom";
import { getOrSaveFromLocal } from "../helpers/helper";
import { useSelector } from "react-redux";
import { StoreState } from "../interfaces/storeInterface";
import DesktopSidebar from "../components/shared/DesktopSidebar";
import { BsFillArrowLeftSquareFill } from "react-icons/bs";

function NewStoryPage() {
  const navigate = useNavigate();
  const [caption, setCaption] = useState("");
  const [captionColor, setCaptionColor] = useState("black");
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const imageRef = useRef<HTMLInputElement | null>(null);
  const image = useFileHandler("single");
  const [addStory] = useAsyncMutation(useAddStoryMutation);
  const { user } = useSelector((state: StoreState) => state.userSlice);

  const handleNewStory = async () => {
    const formData = new FormData();
    if (image.file) {
      formData.append("single", image.file);
    }
    formData.append("caption", caption);
    try {
      await addStory("Adding...", { data: formData });
      getOrSaveFromLocal({
        key: "CAPTION_STYLE",
        value: { position: position, textColor: captionColor },
        get: false,
      });
      navigate("/");
    } catch (error) {
      console.error("Error creating post:", error);
    }
  };
  //   console.log(position);
  useEffect(() => {
    if (image.error) toast.error(image.error);
  }, [image.error]);
  return (
    <section>
      <DesktopSidebar />
      <div className="lg:w-[600px] lg:m-auto lg:py-6 bg-black relative">
        {image.preview ? (
          <div className="w-full flex lg:flex-col justify-center items-center h-screen lg:h-[95vh]">
            <Chip className="top-3 absolute right-3 z-40 lg:right-10 lg:top-10">
              <span
                className="flex justify-center items-center font-semibold"
                onClick={() => imageRef.current?.click()}
              >
                <BiEdit className="text-lg mr-1" />
                Change image
              </span>
            </Chip>
            <div className=" absolute top-3 left-3 lg:top-10 lg:left-10 flex gap-4 justify-center items-center">
              <Dropdown closeOnSelect={false}>
                <DropdownTrigger>
                  <Chip>
                    <span className="flex justify-center items-center font-semibold">
                      <div
                        className="w-4 h-4 rounded-full mr-1"
                        style={{ background: captionColor }}
                      ></div>
                      Text color
                    </span>
                  </Chip>
                </DropdownTrigger>
                <DropdownMenu aria-label="Static Actions">
                  <DropdownItem>
                    <div className="flex justify-center items-center">
                      <ChromePicker
                        color={captionColor}
                        onChangeComplete={(color: { hex: string }) =>
                          setCaptionColor(color.hex)
                        }
                      />
                    </div>
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </div>
            <img
              className="h-auto w-[100vw] lg:max-h-[300px] lg:w-auto"
              src={image.preview}
              alt="jj"
            />
            <Draggable
              position={position}
              onDrag={(data: any) => setPosition({ x: data.x, y: data.y })}
            >
              <h1
                className="text-2xl absolute z-40 bottom-32 font-bold w-[80vw] text-center"
                style={{ color: captionColor }}
              >
                {caption}
              </h1>
            </Draggable>
            <div className="flex justify-around items-center text-white m-0 bg-black/50 fixed bottom-0 p-3 w-full lg:bottom-4 lg:w-[450px]">
              <Avatar src={user?.avatar?.url} />
              <Input
                placeholder="Add a caption"
                className="w-[250px] lg:w-[300px]"
                isClearable
                variant="underlined"
                classNames={{ input: "text-white" }}
                color="primary"
                onValueChange={setCaption}
              />
              <BiSend className="text-2xl" onClick={handleNewStory} />
            </div>
          </div>
        ) : (
          <div className="bg-white text-black w-full h-screen flex flex-col justify-center items-center relative">
            <Link to={"/"}>
              <BsFillArrowLeftSquareFill className=" absolute top-4 left-4 text-3xl" />
            </Link>
            <BiPlusCircle
              className="text-9xl"
              onClick={() => imageRef.current?.click()}
            />
            <p className="text-lg m-1">Import image to add</p>
          </div>
        )}
      </div>
      <input
        type="file"
        ref={imageRef}
        onChange={image.changeHandler}
        className="hidden"
      />
    </section>
  );
}

export default NewStoryPage;
