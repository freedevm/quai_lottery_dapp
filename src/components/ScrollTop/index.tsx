"use client";

import { useEffect, useState } from "react";

import ArrowUpwardRoundedIcon from "@mui/icons-material/ArrowUpwardRounded";

export default function ScrollTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const scrollListener = () => {
      setVisible(window.scrollY > 200);
    };
    window.addEventListener("scroll", scrollListener);
    return () => window.removeEventListener("scroll", scrollListener);
  }, []);

  const scrollTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <button
      className="fixed right-12 bottom-20 flex justify-center items-center bg-[#ffffff10] rounded-full z-[9999] w-12 h-12 shadow-lg opacity-0 transition-all duration-200 ease-in data-[visible=true]:opacity-100 data-[visible=true]:bottom-[2rem]"
      data-visible={visible}
      onClick={scrollTop}
    >
      <ArrowUpwardRoundedIcon />
    </button>
  );
}
