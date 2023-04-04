import React, { useState } from "react";
import {AiOutlineInsurance,AiTwotoneHome,} from "react-icons/ai";
import { ImBooks } from "react-icons/im";
import { GoFileSubmodule } from "react-icons/go";
import { RiMessage2Fill } from "react-icons/ri"; 

export const UserSite = () => {
  const defaultImageURL = `${process.env.PUBLIC_URL}/defaultimage.png`;
  const [selectedImage, setSelectedImage] = useState(defaultImageURL);


  const onImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = URL.createObjectURL(e.target.files[0]);
      setSelectedImage(file);
      e.target.value = null;
    }
  };

  return (
    <div className="h-screen w-screen flex justify-center items-center bg-black">
      <div className="h-full w-5/6 bg-blue-200">
        <div className="flex-initial w-80 container flex place-items-center gap-4 flex-col h-full">
          <div className="static">
            <span className="font-sans text-7xl">
              <AiOutlineInsurance />
            </span>
          </div>

          <div className="space-y-8">
            <div className="">
              <span className="font-sans text-4xl absolute -mx-14">
                <AiTwotoneHome />
              </span>
              <span className="font-sans text-3xl">Home</span>
            </div>

            <div className="">
              <span className="font-sans text-4xl absolute -mx-14">
                <ImBooks />
              </span>
              <span className="font-sans text-3xl">Policies</span>
            </div>

            <div>
              <span className="font-sans text-4xl absolute -mx-14">
                <GoFileSubmodule />
              </span>
              <span className="font-sans text-3xl">Services</span>
            </div>
            <div>
              <span className="font-sans text-4xl absolute -mx-14">
                <RiMessage2Fill />
              </span>
              <span className="font-sans text-3xl">Messages</span>
            </div>
            
          </div>
           <div className="mt-auto place-self-start ml-9">  
            <label htmlFor="uploadIcon">
                <img
                    className="justify-self-start cursor-pointer w-20 h-20 rounded-full object-cover border-4 border-solid border-cyan-300"
                    src={selectedImage}
                    alt="Profile"
                />
            </label>
            <input
                className="hidden"
                accept="image/jpeg, image/png"
                type="file"
                id="uploadIcon"
                onChange={onImageChange}
            />
           </div>
        </div>
        <div className="ml-16">
          {/* Parent div for newsfeed and title */}
          <div>
            {/* title div */}
          </div>
          <div>
            {/* Newsfeed div */}
          </div>
        </div>
      </div>
    </div>
  );
};
