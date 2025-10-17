import { assets } from "@/assets/assets";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import "../app/globals.css";

const Header = () => {
  return (
    <div className="w-11/12 max-w-3xl text-center mx-auto h-screen flex flex-col items-center justify-center gap-4">
      <Image
        src={assets.pp}
        alt=""
        className="rounded-full w-32 object-cover "
        width={128}
        height={128}
      />
      <h3 className="flex items-end gap-2 text-xl md:text-2xl mb-3 font-family-ovo">
        Hi! I'm Rashmin Sharma{" "}
        <Image src={assets.hand_icon} alt="" className="w-6" />
      </h3>
      <h1 className="text-3xl sm:text-6xl lg:text-[66px] font-family-ovo">
        Senior Developer at Charibazar.
      </h1>
      <p className="max-w-2xl mx-auto font-ovo">
        I am a Fullstack Developer from Nepal with 2 years of experience in
        multiple companies.
      </p>
      <div className="flex flex-col sm:flex-row items-center gap-4 mt-4">
        <Link
          href="#contact"
          className="px-10 py-3 border border-white rounded-full bg-black text-white flex items-center gap-2 dark:bg-transparent"
        >
          Contact Me
          <Image src={assets.right_arrow_white} alt="" className="w-4" />
        </Link>
        <Link
          href="/sample.resume.pdf"
          download
          className="px-10 py-3 border rounded-full border-gray-500 flex items-center gap-2 bg-white dark:text-black"
        >
          My Resume <Image src={assets.download_icon} alt="" className="w-4" />
        </Link>
      </div>
    </div>
  );
};

export default Header;
