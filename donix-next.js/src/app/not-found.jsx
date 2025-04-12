import Image from "next/image";
import Link from "next/link";
import { TbFaceIdError } from "react-icons/tb";

const NotFoundPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white p-4">
      <header className="w-full text-center py-6 font-bold text-6xl md:text-8xl flex items-center justify-center gap-2">
         NOT FOUND 
        <i className="text-blue-500 pl-4 md:pl-8 pt-2">
          <TbFaceIdError className="w-16 h-16 md:w-24 md:h-24" />
        </i>
      </header>
      <section className="flex flex-col md:flex-row items-center justify-center mt-12 px-4 md:px-16 lg:px-24 gap-8">
        <div className="image flex justify-center md:w-1/2">
          <Image
            src={"/error.png"}
            alt="signal"
            className="w-64 md:w-80 lg:w-96 animate-pulse"
            width={384}
            height={384}
          />
        </div>
        <div className="text flex flex-col items-center md:items-start md:w-1/2 gap-4 text-center md:text-left">
          <p className="text-lg md:text-xl w-full md:w-3/4 lg:w-2/3">
            The page you were looking for does not exist or is temporarily unavailable.
          </p>
          <Link
            href="/"
            className="text-black bg-white px-6 py-3 rounded-md transition duration-300 hover:bg-gray-800 hover:text-white border border-white"
          >
            Back to Homepage
          </Link>
        </div>
      </section>
    </div>
  );
};

export default NotFoundPage;
