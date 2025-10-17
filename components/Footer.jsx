import { assets } from "@/assets/assets";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const Footer = ({ isDarkMode }) => {
  return (
    <div className="mt-20">
      <div className="text-center">
        <Image
          src={isDarkMode ? assets.logo_dark : assets.logo}
          alt=""
          className="w-36 mx-auto mb-2"
        />
        <div className="w-max flex items-center gap-2 mx-auto">
          <Image
            src={isDarkMode ? assets.mail_icon_dark : assets.mail_icon}
            alt=""
            className="w-6"
          />
          rashminxperience@gmail.com
        </div>
      </div>
      <div className="text-center sm:flex items-center justify-between border-t border-gray-400 max-[10%] mt-12 py-6">
        <p>©️ 2025 Rashmin Sharma. All rights reserved.</p>
        <ul className="flex items-center gap-10 justify-center mt-4 sm:mt-0">
          <li>
            <Link target="_blank" href="https://github.com/Rashmin47">
              Github
            </Link>
          </li>
          <li>
            <Link
              target="_blank"
              href="https://github.https://www.linkedin.com/in/rashmin-sharma-656bb332a/"
            >
              LinkedIn
            </Link>
          </li>
          <li>
            <Link target="_blank" href="https://github.com/Rashmin47">
              Twitter
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Footer;
