"use client";

import "./style.scss";

interface Props {
  setLoading: (e: boolean) => void;
  setFirstLoad: (e: boolean) => void;
  dataFetched: boolean;
}

// let globalLoading: boolean = true;

export default function PreLoading({
  setLoading,
  setFirstLoad,
  dataFetched,
}: Props) {
  const onClick = () => {
    dataFetched && setLoading(false);
    dataFetched && setFirstLoad(false);
  };
  return (
    <div onClick={() => onClick()}>
      <div className="w-full h-screen relative flex justify-center items-center bg-purple-950 text-2xl overflow-hidden">
        <div className="w-[173px] h-[173px] bg-purple-300 rounded-full blur-[150px] absolute top-4 -right-4 vertical-negative-crossing"></div>
        <div className="w-[173px] h-[173px] bg-purple-300 rounded-full blur-[150px] absolute bottom-4 -left-4 vertical-possitive-crossing"></div>

        <div className="absolute w-full h-full flex items-center justify-center">
          <div>
            <span className="font-normal text-purple-500 text-[51.85px] leading-[38.77px] font-[Inter] fade-in-out">
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
              Ethereum Lottery
            </span>
          </div>
        </div>
        {dataFetched ? (
          <div className="w-full h-full text-center absolute top-[75%]">
            <div className="swipe-btn-fade-in">
              <p className="font-normal text-[#DADADA] text-[14px] leading-[11.62px] font-[Inter] fade-in">
                CLICK TO START
              </p>
            </div>
          </div>)
          : (<div className="w-full h-full text-center absolute top-[75%]">
            <div className="swipe-btn-fade-in">
              <div className="text-center">
                <div role="status">
                  <svg aria-hidden="true" className="inline w-8 h-8 text-purple-700 animate-spin dark:text-gray-600 fill-white" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                    <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
                  </svg>
                  <span className="sr-only">Loading...</span>
                </div>
              </div>
            </div>
          </div>)
        }
        <div className=" absolute w-full h-full">
          <div className=" h-full  flex items-center justify-center">
            <div className="text-center font-[Inter]">
              <p className="text-[#FFFFFF] font-extrabold leading-[64.64px] text-[60px] vertical-title-negative-crossing">
                ETHEREUM
              </p>
              <p className="text-[#FFFFFF] font-extrabold leading-[64.64px] text-[60px] vertical-title-possitive-crossing">
                LOTTERY
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
