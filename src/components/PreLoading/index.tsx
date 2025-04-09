"use client";
// import "./style.module.css";

import "./style.scss";

import Image from "next/image";

import Logo from "../../../public/images/brand_logo_with_text.png";

interface Props {
  loading: boolean;
  setLoading: (e: boolean) => void;
  setFirstLoad: (e: boolean) => void;
}

// let globalLoading: boolean = true;

export default function PreLoading({
  loading,
  setLoading,
  setFirstLoad,
}: Props) {
  const onClick = () => {
    setLoading(false);
    setFirstLoad(false);
  };
  return (
    <div onClick={() => onClick()}>
      <div className="w-full h-screen relative flex justify-center items-center bg-black text-2xl overflow-hidden">
        <div className="w-[173px] h-[173px] bg-purple-500 rounded-full blur-[150px] absolute top-4 -right-4 vertical-negative-crossing"></div>
        <div className="w-[173px] h-[173px] bg-purple-500 rounded-full blur-[150px] absolute bottom-4 -left-4 vertical-possitive-crossing"></div>

        <div className="absolute w-full h-full flex items-center justify-center">
          <div>
            <span className="font-normal text-purple-500 text-[51.85px] leading-[38.77px] font-[IntegralCF] fade-in-out">
              MEGA JACKPOT
            </span>
          </div>
        </div>
        <div className="w-full h-full text-center absolute top-[85%]">
          <div>
            <span className="font-extralight text-[#DADADA] text-[14px] leading-[10.47px] font-[Mulish] fade-in">
              Powered by&nbsp;&nbsp;&nbsp;
            </span>
            <span className="font-extrabold text-[#DADADA] text-[14px] leading-[10.47px] font-[Monument] fade-in">
              Rainbow
            </span>
          </div>
        </div>

        <div className="w-full h-full text-center absolute top-[75%]">
          <div className="swipe-btn-fade-in">
            <p className="font-normal text-[#DADADA] text-[14px] leading-[11.62px] font-[Inter] fade-in">
              CLICK TO START
            </p>
          </div>
        </div>

        <div className=" absolute w-full h-full">
          <div className=" h-full  flex items-center justify-center">
            <div className="text-center font-[IntegralCF]">
              <p className="text-[#FFFFFF] font-extrabold leading-[64.64px] text-[60px] italic horizontal-negative-crossing">
                ETHEREUM
              </p>
              <p className="text-[#FFFFFF] font-extrabold leading-[64.64px] text-[60px] italic horizontal-possitive-crossing">
                LOTTERY
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
