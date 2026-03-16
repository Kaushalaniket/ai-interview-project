"use client";

import React, { useEffect } from "react";
import { UserButton } from "@clerk/nextjs";
import { usePathname } from "next/navigation";

function Header() {
  const path = usePathname();

  useEffect(() => {
    console.log("Current Path:", path);
  }, [path]);

  return (
    <div className='flex p-4 items-center justify-between bg-secondary shadow-sm'>
      <img src="/logo.svg" width={160} height={100} alt="logo" />

      <ul className='flex gap-6'>

  <li
    className={`
      cursor-pointer transition-all duration-200 
      hover:text-blue-600 hover:font-semibold
      ${path === "/dashboard" && "text-blue-600 font-bold"}
    `}
  >
    Dashboard
  </li>

  <li
    className={`
      cursor-pointer transition-all duration-200 
      hover:text-blue-600 hover:font-semibold
      ${path === "/dashboard/questions" && "text-blue-600 font-bold"}
    `}
  >
    Questions
  </li>

  <li
    className={`
      cursor-pointer transition-all duration-200 
      hover:text-blue-600 hover:font-semibold
      ${path === "/dashboard/upgrade" && "text-blue-600 font-bold"}
    `}
  >
    Upgrade
  </li>

  <li
    className={`
      cursor-pointer transition-all duration-200 
      hover:text-blue-600 hover:font-semibold
      ${path === "/dashboard/how-it-works" && "text-blue-600 font-bold"}
    `}
  >
    How it Works?
  </li>

</ul>


      <UserButton />
    </div>
  );
}

export default Header;
