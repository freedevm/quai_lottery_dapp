"use client";

import { AppContext } from "@/lib/providers/AppContextProvider";
import { useContext } from "react"

export default function Investors () {
    const { data } = useContext(AppContext);

    return (
        <div className="w-full rounded-2xl p-2 sm:px-4 sm:py-5 flex flex-col justify-center ml-auto mr-auto lg:even:ml-0 lg:odd:mr-0 relative">
            <h2 className="text-2xl sm:text-3xl md:text-4xl text-center font-bold my-2 text-white uppercase">Investors in mega jackpot</h2>
            <p className="text-center text-lg sm:text-xl px-2 mb-2 font-bold">Total : {data.investors.length}</p>
            <div className="relative flex flex-col rounded-lg w-full">
                <nav className="flex flex-col gap-1">
                    {data.investors && data.investors.map((investor, index) => 
                        <div
                            key={index}
                            role="button"
                            className="sm:justify-center px-4 py-1 truncate text-sm sm:text-md text-white min-h-2 flex w-full items-center rounded-md transition-all hover:bg-purple-800 focus:bg-purple-800 active:bg-purple-800"
                        >
                            {investor.toLocaleString()}
                        </div>
                    )}
                </nav>
            </div>
        </div>
    )
}