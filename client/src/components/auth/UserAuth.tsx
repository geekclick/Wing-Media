import { useState } from "react";
import {
  Tabs,
  Tab,
  Input,
  Link,
  Button,
  Card,
  CardBody,
  Modal,
  ModalContent,
  ModalBody,
} from "@nextui-org/react";
import { CgMail } from "react-icons/cg";
import { BsEye, BsEyeSlash } from "react-icons/bs";
import { User } from "../../interfaces/common";
import { SubmitHandler, useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { setIsLoggedIn } from "../../store/reducers/authSlice";
import { StoreState } from "../../interfaces/storeInterface";
import axios from "axios";
import toast from "react-hot-toast";
import { SERVER_URL } from "../../constants";

export default function UserAuth() {
  const dispatch = useDispatch();
  const {
    register,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm<User>();

  const [selected, setSelected] = useState<string>("login");
  const login = useSelector((state: StoreState) => state.authSlice.isLoggedIn);

  const [isVisible, setIsVisible] = useState(false);
  const toggleVisibility = () => setIsVisible(!isVisible);

  const handleSelectionChange = (key: string | number) => {
    setSelected(String(key));
  };

  const handleLogin: SubmitHandler<User> = async (formData, e) => {
    e?.preventDefault();
    try {
      const response = await axios.post(
        `${SERVER_URL}/api/auth/login`,
        formData,
        { withCredentials: true }
      );
      if (response) {
        dispatch(setIsLoggedIn(true));
        toast.success("Login Successful!");
        reset();
      }
    } catch (error: any) {
      console.log(error.response.data.message);
      toast.error(error.response.data.message);
    }
  };
  const handleRegister: SubmitHandler<User> = async (formData, e) => {
    e?.preventDefault();
    try {
      const response = await axios.post(
        `${SERVER_URL}/api/auth/register`,
        formData,
        { withCredentials: true }
      );
      if (response) {
        dispatch(setIsLoggedIn(true));
        toast.success("Register Successful!");
        window.location.href = "/profile/edit";
        reset();
      }
    } catch (error: any) {
      console.log(error.response.data.message);
      toast.error(error.response.data.message);
    }
  };

  return (
    <Modal
      isOpen={!login}
      placement="center"
      hideCloseButton
      backdrop="blur"
      className=" bg-transparent shadow-none"
    >
      <ModalContent>
        {() => (
          <>
            <ModalBody>
              <div className="flex flex-col w-full items-center">
                <Card className="max-w-full w-[340px] lg:w-[600px]">
                  <CardBody className="overflow-hidden p-4">
                    <Tabs
                      fullWidth
                      size="md"
                      aria-label="Tabs form"
                      selectedKey={selected}
                      onSelectionChange={handleSelectionChange}
                    >
                      <Tab key="login" title="Login">
                        <form
                          className="flex flex-col gap-4 lg:gap-8"
                          onSubmit={handleSubmit(handleLogin)}
                        >
                          <Input
                            autoFocus
                            endContent={
                              <CgMail className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
                            }
                            label="Email"
                            isRequired
                            type="email"
                            variant="bordered"
                            {...register("email")}
                          />
                          {errors.email && <span>{errors.email.message}</span>}
                          <Input
                            {...register("password")}
                            label="Password"
                            variant="bordered"
                            isRequired
                            endContent={
                              <button
                                className="focus:outline-none"
                                type="button"
                                onClick={toggleVisibility}
                              >
                                {isVisible ? (
                                  <BsEyeSlash className="text-2xl text-default-400 pointer-events-none" />
                                ) : (
                                  <BsEye className="text-2xl text-default-400 pointer-events-none" />
                                )}
                              </button>
                            }
                            type={isVisible ? "text" : "password"}
                          />
                          {errors.password && (
                            <span>{errors.password.message}</span>
                          )}
                          <p className="text-center text-small">
                            Need to create an account?{" "}
                            <Link
                              size="sm"
                              onPress={() => setSelected("sign-up")}
                            >
                              Sign up
                            </Link>
                          </p>
                          <div className="flex gap-2 justify-end">
                            <Button
                              fullWidth
                              color="primary"
                              className="text-white"
                              type="submit"
                            >
                              Login
                            </Button>
                          </div>
                        </form>
                      </Tab>
                      <Tab key="sign-up" title="Sign up">
                        <form
                          className="flex flex-col gap-4 lg:gap-8"
                          onSubmit={handleSubmit(handleRegister)}
                        >
                          <Input
                            autoFocus
                            startContent={"@"}
                            label="Username"
                            variant="bordered"
                            pattern="^[a-zA-Z0-9_]+$"
                            errorMessage="Only letters, numbers, and _ are allowed"
                            isRequired
                            {...register("username")}
                          />
                          <Input
                            isRequired
                            label="Name"
                            type="text"
                            variant="bordered"
                            {...register("name")}
                          />
                          <Input
                            endContent={
                              <CgMail className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
                            }
                            label="Email"
                            isRequired
                            type="email"
                            variant="bordered"
                            {...register("email")}
                          />
                          <Input
                            {...register("password")}
                            label="Password"
                            variant="bordered"
                            isRequired
                            endContent={
                              <button
                                className="focus:outline-none"
                                type="button"
                                onClick={toggleVisibility}
                              >
                                {isVisible ? (
                                  <BsEyeSlash className="text-2xl text-default-400 pointer-events-none" />
                                ) : (
                                  <BsEye className="text-2xl text-default-400 pointer-events-none" />
                                )}
                              </button>
                            }
                            type={isVisible ? "text" : "password"}
                          />
                          <p className="text-center text-small">
                            Already have an account?{" "}
                            <Link
                              size="sm"
                              onPress={() => setSelected("login")}
                            >
                              Login
                            </Link>
                          </p>
                          <div className="flex gap-2 justify-end">
                            <Button
                              fullWidth
                              color="primary"
                              className="text-white"
                              type="submit"
                            >
                              Sign up
                            </Button>
                          </div>
                        </form>
                      </Tab>
                    </Tabs>
                  </CardBody>
                </Card>
              </div>
            </ModalBody>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
