import { assets, serviceData } from "@/assets/assets";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const Services = () => {
  return (
    <div id="services" className="w-full px-[12%] py-10 scroll-mt-20">
      <h4 className="text-center mb-2 text-lg font-ovo">What I Offer</h4>
      <h2 className="text-center text-5xl font-ovo">My Services </h2>
      <p className="text-center max-w-2xl mx-auto mt-b mb-12 font-family-ovo">
        I am a Fullstack Developer from Nepal with 2 years of experience in
        multiple companies.
      </p>
      <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-6 my-10">
        {serviceData.map(({ icon, title, description, link }, index) => (
          <div
            key={index}
            className="border border-gray-400 rounded-lg px-8 py-12 hover:shadow-black cursor-pointer hover:bg-lightHover hover:-translate-x-1 duration-500"
          >
            <Image src={icon} alt="" className="w-10" />
            <h3 className="text-lg my-4 text-gray-700">{title}</h3>
            <p className="text-sm text-gray-600 leading-5">{description}</p>
            <Link href={link} className="flex items-center gap-2 text-sm mt-5">
              Read More
              <Image src={assets.right_arrow} className="w-4" />
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Services;
