"use client";

import { AppContext } from "@/lib/providers/AppContextProvider";
import { Address } from "@/lib/types/lottery";
import { useContext, useEffect, useState } from "react"
import SearchBox from "./SearchBox";

interface InvestorData {
    address: Address;
    ticketCount: number;
}

export default function Investors () {
    const { data, showInvestorTicketCount } = useContext(AppContext);
    const [filteredData, setFilteredData] = useState<InvestorData[]>([]);
    const [searchKey, setSearchKey] = useState<string>("")

    useEffect(() => {
        let investorArr: InvestorData[] = [];
        data.investors.map(address => investorArr.push({address, ticketCount: 0}))
        setFilteredData(investorArr)
    }, [])

    useEffect(() => {
        let filteredResult: InvestorData[] = [];
        data.investors.map(address => (address.toLocaleString().toLocaleLowerCase().includes(searchKey.toLocaleLowerCase())) 
            && filteredResult.push({address, ticketCount: 0}));
        setFilteredData(filteredResult)
    }, [searchKey])

    const showTicketCount = async (address: Address) => {
        
        const res = await showInvestorTicketCount(address)
        setFilteredData(prev => {
            prev.map(investor => investor.address === address && (investor.ticketCount = Number(res)));
            return prev
        })
    }

    return (
        <div className="p-2 w-full max-w-3xl mx-auto sm:px-6 sm:py-4 md:px-10 flex flex-col">
            <h2 className="text-2xl sm:text-3xl md:text-4xl text-center font-bold my-2 text-white uppercase">Investors in mega jackpot</h2>
            <SearchBox
                searchKey={searchKey}
                setSearchKey={setSearchKey}
            />
            <ul className="w-full bg-purple-800 rounded-lg shadow divide-y divide-purple-600 mx-auto">
                {filteredData.length ? filteredData.map((investor, index) => 
                    <li key={index} className="px-2 sm:px-6 py-2 w-full cursor-pointer hover:opacity-80 flex justify-between" onClick={() => showTicketCount(investor.address)} >
                        <span className={`text-purple-200 text-sm sm:text-md truncate  
                        ${(!!investor.ticketCount) && "w-2/3 max-w-2/3"}
                        `}>{investor.address.toLocaleString()}</span>
                        {(!!investor.ticketCount) && <span className="text-sm sm:text-md">{investor.ticketCount} Tickets</span>}
                    </li>
                )
                : !searchKey && (
                    <p className="text-center text-md sm:text-lg uppercase py-3">There are no active investors yet</p>
                )}
            </ul>
        </div>
    )
}