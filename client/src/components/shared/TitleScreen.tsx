import { motion } from "framer-motion";
import { AiFillDingtalkSquare } from "react-icons/ai";

function TitleScreen() {
  return (
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
  );
}

export default TitleScreen;
