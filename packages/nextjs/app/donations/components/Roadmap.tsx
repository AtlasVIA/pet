import React from "react";
import { FaBullhorn, FaCode, FaGlobe, FaHandshake, FaHeart, FaMobileAlt, FaPaw, FaUsers } from "react-icons/fa";

interface RoadmapProps {
  scrollToDonationForm: () => void;
}

const Roadmap: React.FC<RoadmapProps> = ({ scrollToDonationForm }) => {
  const roadmapItems = [
    {
      icon: <FaPaw className="text-4xl text-purple-600" />,
      title: "Launch Platform",
      description:
        "Unleash our Dogachi.Pet platform for virtual pet adoption and donation tracking, revolutionizing the way people connect with animals in need.",
    },
    {
      icon: <FaHandshake className="text-4xl text-blue-600" />,
      title: "Shelter Partnerships",
      description:
        "Forge strong alliances with animal shelters and rescue organizations, creating a network of support for pets awaiting their forever homes.",
    },
    {
      icon: <FaHeart className="text-4xl text-red-600" />,
      title: "Community Outreach",
      description:
        "Develop and implement educational programs to raise awareness about responsible pet ownership and the benefits of adoption.",
    },
    {
      icon: <FaCode className="text-4xl text-green-600" />,
      title: "Enhanced Features",
      description:
        "Continuously improve our platform with new features like virtual pet meet-and-greets, personalized adoption recommendations, and blockchain-verified pet histories.",
    },
    {
      icon: <FaBullhorn className="text-4xl text-yellow-600" />,
      title: "Marketing Campaign",
      description:
        "Launch a multi-channel marketing initiative to increase platform adoption and raise awareness about the importance of pet adoption.",
    },
    {
      icon: <FaUsers className="text-4xl text-indigo-600" />,
      title: "Volunteer Network",
      description:
        "Establish a decentralized network of volunteers to support local shelters, foster pets, and assist with adoption events.",
    },
    {
      icon: <FaMobileAlt className="text-4xl text-pink-600" />,
      title: "Mobile App Launch",
      description:
        "Develop and release a mobile application to make pet adoption and donation processes even more accessible and user-friendly.",
    },
    {
      icon: <FaGlobe className="text-4xl text-teal-600" />,
      title: "Global Expansion",
      description:
        "Extend our paw prints across the globe, connecting pets with loving homes worldwide and adapting to diverse cultural contexts.",
    },
  ];

  return (
    <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-8 md:p-12 rounded-3xl shadow-lg transition-all duration-500 ease-in-out hover:shadow-2xl relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>
      <h2 className="text-3xl md:text-4xl font-bold text-indigo-800 mb-6 text-center relative inline-block">
        Our Paw-some Journey
        <span className="absolute -bottom-2 left-0 w-full h-1 bg-indigo-500"></span>
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {roadmapItems.map((item, index) => (
          <div
            key={index}
            className="bg-white rounded-xl p-6 shadow-md transition-all duration-300 hover:shadow-xl hover:scale-105 flex flex-col items-center text-center"
          >
            <div className="mb-4 transform transition-all duration-300 hover:scale-110 hover:rotate-12">
              {item.icon}
            </div>
            <h3 className="text-xl font-semibold mb-2 text-indigo-700">{item.title}</h3>
            <p className="text-gray-600 text-sm">{item.description}</p>
          </div>
        ))}
      </div>
      <div className="mt-12 text-center">
        <p className="text-xl font-semibold mb-6 text-indigo-800">Help us make these paw-sibilities a reality!</p>
        <button
          onClick={scrollToDonationForm}
          className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-bold py-3 px-8 rounded-full transition-all duration-300 ease-in-out hover:from-indigo-600 hover:to-purple-700 transform hover:scale-105 shadow-lg hover:shadow-xl"
        >
          Join Our Pack
        </button>
      </div>
      <div className="absolute bottom-0 right-0 w-32 h-32 bg-indigo-100 rounded-tl-full opacity-50"></div>
      <div className="absolute top-1/4 left-0 w-16 h-16 bg-pink-100 rounded-full opacity-30"></div>
      <div className="absolute top-3/4 right-1/4 w-24 h-24 bg-purple-100 rounded-full opacity-40"></div>
    </div>
  );
};

export default Roadmap;
