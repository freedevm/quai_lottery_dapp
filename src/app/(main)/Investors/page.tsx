"use client";

import { AppContext } from "@/lib/providers/AppContextProvider";
import { Address } from "@/lib/types/lottery";
import { useContext, useState } from "react"

export default function Investors () {
    const { data, showInvestorTicketCount } = useContext(AppContext);
    const [selectedUserAddress, setSelectedUserAddress] = useState<Address>();
    const [selectedUserTickets, setSelectedUserTickets] = useState<number>(0);

    const showTicketCount = async (address: Address) => {
        setSelectedUserAddress(address);

        const res = await showInvestorTicketCount(address)
        setSelectedUserTickets(Number(res))
    }

    return (
        <div className="p-2 w-full sm:px-6 sm:py-4 md:px-10 flex flex-col">
            <h2 className="text-2xl sm:text-3xl md:text-4xl text-center font-bold my-2 text-white uppercase">Investors in mega jackpot</h2>
            <ul className="w-full bg-purple-800 rounded-lg shadow divide-y divide-purple-600 mx-auto">
                {data.investors && data.investors.map((investor, index) => 
                    <li key={index} className="px-2 sm:px-6 py-2 w-full cursor-pointer hover:opacity-80 flex justify-between" onClick={() => showTicketCount(investor)} >
                        <span className={`text-purple-200 text-sm sm:text-md truncate  
                            ${(selectedUserTickets !== 0 && selectedUserAddress === investor) && "w-2/3 max-w-2/3"}
                        `}>{investor.toLocaleString()}</span>
                        {/* <span>5 tickets</span> */}
                        {(selectedUserTickets !== 0 && selectedUserAddress === investor) && <span className="text-sm sm:text-md">{selectedUserTickets} Tickets</span>}
                    </li>
                )}
            </ul>
        </div>
    )
}