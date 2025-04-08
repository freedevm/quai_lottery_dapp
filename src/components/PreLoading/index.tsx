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
        <div className="w-[173px] h-[173px] bg-[#BDFF00] rounded-full blur-[150px] absolute top-4 -right-4 vertical-negative-crossing"></div>
        <div className="w-[173px] h-[173px] bg-[#BDFF00] rounded-full blur-[150px] absolute bottom-4 -left-4 vertical-possitive-crossing"></div>

        <div className="absolute w-full h-full flex items-center justify-center">
          <div>
            <span className="font-normal text-[#BDFF00] text-[51.85px] leading-[38.77px] font-[IntegralCF] fade-in-out">
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
              PAAL AI
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

        <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center">
          <div className="flex justify-center items-center w-full h-full">
            <div className="relative">
              <div className="w-[430px] h-[175px]">
                <div className="w-[250px] h-[175px] absolute left-[-11px] animate-rounds-fade-in-out-three">
                  <svg
                    width="250"
                    height="175"
                    viewBox="0 0 250 175"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M247.5 87.5C247.5 110.623 234.114 131.812 211.955 147.324C189.803 162.83 159.068 172.5 125 172.5C90.9322 172.5 60.1969 162.83 38.0453 147.324C15.8858 131.812 2.5 110.623 2.5 87.5C2.5 64.3772 15.8858 43.1879 38.0453 27.6762C60.1969 12.1701 90.9322 2.5 125 2.5C159.068 2.5 189.803 12.1701 211.955 27.6762C234.114 43.1879 247.5 64.3772 247.5 87.5Z"
                      stroke="#BDFF00"
                      strokeWidth="5"
                    />
                    <path
                      d="M247.5 87.5C247.5 110.623 234.114 131.812 211.955 147.324C189.803 162.83 159.068 172.5 125 172.5C90.9322 172.5 60.1969 162.83 38.0453 147.324C15.8858 131.812 2.5 110.623 2.5 87.5C2.5 64.3772 15.8858 43.1879 38.0453 27.6762C60.1969 12.1701 90.9322 2.5 125 2.5C159.068 2.5 189.803 12.1701 211.955 27.6762C234.114 43.1879 247.5 64.3772 247.5 87.5Z"
                      stroke="url(#paint0_linear_187_470)"
                      strokeWidth="5"
                    />
                    <defs>
                      <linearGradient
                        id="paint0_linear_187_470"
                        x1="248"
                        y1="90.5"
                        x2="-61.5"
                        y2="87"
                        gradientUnits="userSpaceOnUse"
                      >
                        <stop stopColor="#BDFF00" />
                        <stop offset="0.785" stopColor="#252525" />
                      </linearGradient>
                    </defs>
                  </svg>
                </div>
                <div className="w-[250px] h-[175px] absolute left-[28px] animate-rounds-fade-in-out-two">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="250"
                    height="175"
                    viewBox="0 0 250 175"
                    fill="none"
                  >
                    <path
                      d="M247.5 87.5C247.5 110.623 234.114 131.812 211.955 147.324C189.803 162.83 159.068 172.5 125 172.5C90.9322 172.5 60.1969 162.83 38.0453 147.324C15.8858 131.812 2.5 110.623 2.5 87.5C2.5 64.3772 15.8858 43.1879 38.0453 27.6762C60.1969 12.1701 90.9322 2.5 125 2.5C159.068 2.5 189.803 12.1701 211.955 27.6762C234.114 43.1879 247.5 64.3772 247.5 87.5Z"
                      stroke="#BDFF00"
                      strokeWidth="5"
                    />
                    <path
                      d="M247.5 87.5C247.5 110.623 234.114 131.812 211.955 147.324C189.803 162.83 159.068 172.5 125 172.5C90.9322 172.5 60.1969 162.83 38.0453 147.324C15.8858 131.812 2.5 110.623 2.5 87.5C2.5 64.3772 15.8858 43.1879 38.0453 27.6762C60.1969 12.1701 90.9322 2.5 125 2.5C159.068 2.5 189.803 12.1701 211.955 27.6762C234.114 43.1879 247.5 64.3772 247.5 87.5Z"
                      stroke="url(#paint0_linear_187_476)"
                      strokeWidth="5"
                    />
                    <defs>
                      <linearGradient
                        id="paint0_linear_187_476"
                        x1="248"
                        y1="90.5"
                        x2="-61.5"
                        y2="87"
                        gradientUnits="userSpaceOnUse"
                      >
                        <stop stopColor="#BDFF00" />
                        <stop offset="0.785" stopColor="#252525" />
                      </linearGradient>
                    </defs>
                  </svg>
                </div>
                <div className="w-[250px] h-[175px] absolute left-[67px] animate-rounds-fade-in-out-one">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="250"
                    height="175"
                    viewBox="0 0 250 175"
                    fill="none"
                  >
                    <path
                      d="M247.5 87.5C247.5 110.623 234.114 131.812 211.955 147.324C189.803 162.83 159.068 172.5 125 172.5C90.9322 172.5 60.1969 162.83 38.0453 147.324C15.8858 131.812 2.5 110.623 2.5 87.5C2.5 64.3772 15.8858 43.1879 38.0453 27.6762C60.1969 12.1701 90.9322 2.5 125 2.5C159.068 2.5 189.803 12.1701 211.955 27.6762C234.114 43.1879 247.5 64.3772 247.5 87.5Z"
                      stroke="#BDFF00"
                      strokeWidth="5"
                    />
                    <path
                      d="M247.5 87.5C247.5 110.623 234.114 131.812 211.955 147.324C189.803 162.83 159.068 172.5 125 172.5C90.9322 172.5 60.1969 162.83 38.0453 147.324C15.8858 131.812 2.5 110.623 2.5 87.5C2.5 64.3772 15.8858 43.1879 38.0453 27.6762C60.1969 12.1701 90.9322 2.5 125 2.5C159.068 2.5 189.803 12.1701 211.955 27.6762C234.114 43.1879 247.5 64.3772 247.5 87.5Z"
                      stroke="url(#paint0_linear_187_479)"
                      strokeWidth="5"
                    />
                    <defs>
                      <linearGradient
                        id="paint0_linear_187_479"
                        x1="248"
                        y1="90.5"
                        x2="-123.5"
                        y2="87"
                        gradientUnits="userSpaceOnUse"
                      >
                        <stop stopColor="#BDFF00" />
                        <stop offset="0.785" stopColor="#252525" />
                      </linearGradient>
                    </defs>
                  </svg>
                </div>
                <div className="w-[250px] h-[175px] absolute left-[114px] animate-rounds-fade-in-out-one">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="250"
                    height="175"
                    viewBox="0 0 250 175"
                    fill="none"
                  >
                    <path
                      d="M247.5 87.5C247.5 110.623 234.114 131.812 211.955 147.324C189.803 162.83 159.068 172.5 125 172.5C90.9322 172.5 60.1969 162.83 38.0453 147.324C15.8858 131.812 2.5 110.623 2.5 87.5C2.5 64.3772 15.8858 43.1879 38.0453 27.6762C60.1969 12.1701 90.9322 2.5 125 2.5C159.068 2.5 189.803 12.1701 211.955 27.6762C234.114 43.1879 247.5 64.3772 247.5 87.5Z"
                      stroke="#BDFF00"
                      strokeWidth="5"
                    />
                    <path
                      d="M247.5 87.5C247.5 110.623 234.114 131.812 211.955 147.324C189.803 162.83 159.068 172.5 125 172.5C90.9322 172.5 60.1969 162.83 38.0453 147.324C15.8858 131.812 2.5 110.623 2.5 87.5C2.5 64.3772 15.8858 43.1879 38.0453 27.6762C60.1969 12.1701 90.9322 2.5 125 2.5C159.068 2.5 189.803 12.1701 211.955 27.6762C234.114 43.1879 247.5 64.3772 247.5 87.5Z"
                      stroke="url(#paint0_linear_187_478)"
                      strokeWidth="5"
                    />
                    <defs>
                      <linearGradient
                        id="paint0_linear_187_478"
                        x1="26"
                        y1="87"
                        x2="291"
                        y2="87"
                        gradientUnits="userSpaceOnUse"
                      >
                        <stop stopColor="#BDFF00" />
                        <stop offset="1" stopColor="#252525" />
                      </linearGradient>
                    </defs>
                  </svg>
                </div>
                <div className="w-[250px] h-[175px] absolute left-[153px] animate-rounds-fade-in-out-two">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="250"
                    height="175"
                    viewBox="0 0 250 175"
                    fill="none"
                  >
                    <path
                      d="M247.5 87.5C247.5 110.623 234.114 131.812 211.955 147.324C189.803 162.83 159.068 172.5 125 172.5C90.9322 172.5 60.1969 162.83 38.0453 147.324C15.8858 131.812 2.5 110.623 2.5 87.5C2.5 64.3772 15.8858 43.1879 38.0453 27.6762C60.1969 12.1701 90.9322 2.5 125 2.5C159.068 2.5 189.803 12.1701 211.955 27.6762C234.114 43.1879 247.5 64.3772 247.5 87.5Z"
                      stroke="#BDFF00"
                      strokeWidth="5"
                    />
                    <path
                      d="M247.5 87.5C247.5 110.623 234.114 131.812 211.955 147.324C189.803 162.83 159.068 172.5 125 172.5C90.9322 172.5 60.1969 162.83 38.0453 147.324C15.8858 131.812 2.5 110.623 2.5 87.5C2.5 64.3772 15.8858 43.1879 38.0453 27.6762C60.1969 12.1701 90.9322 2.5 125 2.5C159.068 2.5 189.803 12.1701 211.955 27.6762C234.114 43.1879 247.5 64.3772 247.5 87.5Z"
                      stroke="url(#paint0_linear_187_475)"
                      strokeWidth="5"
                    />
                    <defs>
                      <linearGradient
                        id="paint0_linear_187_475"
                        x1="26"
                        y1="87"
                        x2="250"
                        y2="98.5"
                        gradientUnits="userSpaceOnUse"
                      >
                        <stop stopColor="#BDFF00" />
                        <stop offset="0.945" stopColor="#252525" />
                      </linearGradient>
                    </defs>
                  </svg>
                </div>
                <div className="w-[250px] h-[175px] absolute left-[192px] animate-rounds-fade-in-out-three">
                  <svg
                    width="250"
                    height="175"
                    viewBox="0 0 250 175"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M247.5 87.5C247.5 110.623 234.114 131.812 211.955 147.324C189.803 162.83 159.068 172.5 125 172.5C90.9322 172.5 60.1969 162.83 38.0453 147.324C15.8858 131.812 2.5 110.623 2.5 87.5C2.5 64.3772 15.8858 43.1879 38.0453 27.6762C60.1969 12.1701 90.9322 2.5 125 2.5C159.068 2.5 189.803 12.1701 211.955 27.6762C234.114 43.1879 247.5 64.3772 247.5 87.5Z"
                      stroke="#BDFF00"
                      strokeWidth="5"
                    />
                    <path
                      d="M247.5 87.5C247.5 110.623 234.114 131.812 211.955 147.324C189.803 162.83 159.068 172.5 125 172.5C90.9322 172.5 60.1969 162.83 38.0453 147.324C15.8858 131.812 2.5 110.623 2.5 87.5C2.5 64.3772 15.8858 43.1879 38.0453 27.6762C60.1969 12.1701 90.9322 2.5 125 2.5C159.068 2.5 189.803 12.1701 211.955 27.6762C234.114 43.1879 247.5 64.3772 247.5 87.5Z"
                      stroke="url(#paint0_linear_187_469)"
                      strokeWidth="5"
                    />
                    <defs>
                      <linearGradient
                        id="paint0_linear_187_469"
                        x1="26"
                        y1="87"
                        x2="250"
                        y2="98.5"
                        gradientUnits="userSpaceOnUse"
                      >
                        <stop stopColor="#BDFF00" />
                        <stop offset="0.945" stopColor="#252525" />
                      </linearGradient>
                    </defs>
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className=" absolute w-full h-full">
          <div className=" h-full  flex items-center justify-center">
            <div className="text-center font-[IntegralCF]">
              <p className="text-[#BDFF00] font-normal leading-[64.64px] text-[60px] italic horizontal-negative-crossing">
                BE THE WINNER
              </p>
              <p className="text-[#BDFF00] font-normal leading-[64.64px] text-[60px] italic horizontal-negative-crossing">
                AT
              </p>
              <p className="text-[#FFFFFF] font-extrabold leading-[64.64px] text-[60px] italic horizontal-possitive-crossing">
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
