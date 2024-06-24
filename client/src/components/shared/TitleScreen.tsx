import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { AiFillDingtalkSquare } from "react-icons/ai";

function TitleScreen() {
  const [show, setShow] = useState(true);
  useEffect(() => {
    setTimeout(() => {
      setShow(false);
    }, 2300);
  }, []);

  return (
    <div className={`${show ? "flex" : "hidden"} fixed z-50 w-full h-screen`}>
      <div className="w-full h-screen flex flex-col bg-white justify-center items-center overflow-hidden relative">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: [1, 40] }}
          transition={{ duration: 2, delay: 1 }}
        >
          <AiFillDingtalkSquare className="text-9xl" />
        </motion.div>
        <p className="font-bold text-inherit flex items-center text-6xl space-x-2">
          Wing
        </p>
        <span className="pl-20 pt-2 font-mono">MEDIA</span>
      </div>
    </div>
  );
}

export default TitleScreen;
