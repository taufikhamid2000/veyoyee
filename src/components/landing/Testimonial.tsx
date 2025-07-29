import React from "react";

const Testimonial = ({
  name,
  role,
  text,
  org,
}: {
  name: string;
  role: string;
  text: string;
  org: string;
}) => (
  <div className="bg-gray-800 rounded-xl p-2 md:p-6 shadow-md border border-gray-700 flex flex-col items-start max-w-xs mx-auto w-full">
    <p className="text-xs md:text-lg text-gray-200 italic mb-2 md:mb-4">
      “{text}”
    </p>
    <div className="text-xs md:text-sm text-blue-300 font-semibold">{name}</div>
    <div className="text-[10px] md:text-xs text-gray-400">
      {role}, {org}
    </div>
  </div>
);

export default Testimonial;
