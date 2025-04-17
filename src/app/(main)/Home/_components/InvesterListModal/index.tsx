import { AppContext } from "@/lib/providers/AppContextProvider";
import { useContext } from "react";

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function InvestorListModal ({ isOpen, onClose }: ModalProps) {
    const { data } = useContext(AppContext);
    console.log("data => ", data)

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[110] overflow-y-auto">
            <div className="bg-purple-900 rounded-lg p-6 max-w-lg w-full mx-4">
            <div className="flex flex-col items-center">
                <h2 className="text-xl font-bold mb-4 text-white uppercase">Investors in mega jackpot</h2>
                <div className="mb-6 w-full">
                    <div className="relative flex flex-col rounded-lg">
                        <nav className="flex flex-col gap-1 max-h-[500px] overflow-y-auto">
                            {data.investors && data.investors.map((investor, index) => 
                                <div
                                    key={index}
                                    role="button"
                                    className="truncate text-sm text-white min-h-2 flex w-full items-center rounded-md p-1 transition-all hover:bg-purple-800 focus:bg-purple-800 active:bg-purple-800"
                                >
                                    {investor.toLocaleString()}
                                </div>
                            )}
                            <div
                                role="button"
                                className="truncate text-sm text-white flex w-full min-h-4 items-center rounded-md p-1 transition-all hover:bg-purple-800 focus:bg-purple-800 active:bg-purple-800"
                            >
                                address
                            </div>
                            <div
                                role="button"
                                className="truncate text-sm text-white flex w-full min-h-4 items-center rounded-md p-1 transition-all hover:bg-purple-800 focus:bg-purple-800 active:bg-purple-800"
                            >
                                address
                            </div>
                            <div
                                role="button"
                                className="truncate text-sm text-white flex w-full min-h-4 items-center rounded-md p-1 transition-all hover:bg-purple-800 focus:bg-purple-800 active:bg-purple-800"
                            >
                                address
                            </div>
                            <div
                                role="button"
                                className="truncate text-sm text-white flex w-full min-h-4 items-center rounded-md p-1 transition-all hover:bg-purple-800 focus:bg-purple-800 active:bg-purple-800"
                            >
                                address
                            </div>
                            <div
                                role="button"
                                className="truncate text-sm text-white flex w-full min-h-4 items-center rounded-md p-1 transition-all hover:bg-purple-800 focus:bg-purple-800 active:bg-purple-800"
                            >
                                address
                            </div>
                            <div
                                role="button"
                                className="truncate text-sm text-white flex w-full min-h-4 items-center rounded-md p-1 transition-all hover:bg-purple-800 focus:bg-purple-800 active:bg-purple-800"
                            >
                                address
                            </div>
                            <div
                                role="button"
                                className="truncate text-sm text-white flex w-full min-h-4 items-center rounded-md p-1 transition-all hover:bg-purple-800 focus:bg-purple-800 active:bg-purple-800"
                            >
                                address
                            </div>

                            <div
                                role="button"
                                className="truncate text-sm text-white flex w-full min-h-4 items-center rounded-md p-1 transition-all hover:bg-purple-800 focus:bg-purple-800 active:bg-purple-800"
                            >
                                address
                            </div>
                            <div
                                role="button"
                                className="truncate text-sm text-white flex w-full min-h-4 items-center rounded-md p-1 transition-all hover:bg-purple-800 focus:bg-purple-800 active:bg-purple-800"
                            >
                                address
                            </div>
                            <div
                                role="button"
                                className="truncate text-sm text-white flex w-full min-h-4 items-center rounded-md p-1 transition-all hover:bg-purple-800 focus:bg-purple-800 active:bg-purple-800"
                            >
                                address
                            </div>

                            <div
                                role="button"
                                className="truncate text-sm text-white flex w-full min-h-4 items-center rounded-md p-1 transition-all hover:bg-purple-800 focus:bg-purple-800 active:bg-purple-800"
                            >
                                address
                            </div>
                            <div
                                role="button"
                                className="truncate text-sm text-white flex w-full min-h-4 items-center rounded-md p-1 transition-all hover:bg-purple-800 focus:bg-purple-800 active:bg-purple-800"
                            >
                                address
                            </div>
                            <div
                                role="button"
                                className="truncate text-sm text-white flex w-full min-h-4 items-center rounded-md p-1 transition-all hover:bg-purple-800 focus:bg-purple-800 active:bg-purple-800"
                            >
                                address
                            </div>
                            <div
                                role="button"
                                className="truncate text-sm text-white flex w-full min-h-4 items-center rounded-md p-1 transition-all hover:bg-purple-800 focus:bg-purple-800 active:bg-purple-800"
                            >
                                address
                            </div>
                            <div
                                role="button"
                                className="truncate text-sm text-white flex w-full min-h-4 items-center rounded-md p-1 transition-all hover:bg-purple-800 focus:bg-purple-800 active:bg-purple-800"
                            >
                                address
                            </div>
                            <div
                                role="button"
                                className="truncate text-sm text-white flex w-full min-h-4 items-center rounded-md p-1 transition-all hover:bg-purple-800 focus:bg-purple-800 active:bg-purple-800"
                            >
                                address
                            </div>
                            <div
                                role="button"
                                className="truncate text-sm text-white flex w-full min-h-4 items-center rounded-md p-1 transition-all hover:bg-purple-800 focus:bg-purple-800 active:bg-purple-800"
                            >
                                address
                            </div>
                            <div
                                role="button"
                                className="truncate text-sm text-white flex w-full min-h-4 items-center rounded-md p-1 transition-all hover:bg-purple-800 focus:bg-purple-800 active:bg-purple-800"
                            >
                                address
                            </div>
                            <div
                                role="button"
                                className="truncate text-sm text-white flex w-full min-h-4 items-center rounded-md p-1 transition-all hover:bg-purple-800 focus:bg-purple-800 active:bg-purple-800"
                            >
                                address
                            </div>

                            <div
                                role="button"
                                className="truncate text-sm text-white flex w-full min-h-4 items-center rounded-md p-1 transition-all hover:bg-purple-800 focus:bg-purple-800 active:bg-purple-800"
                            >
                                address
                            </div>
                            <div
                                role="button"
                                className="truncate text-sm text-white flex w-full min-h-4 items-center rounded-md p-1 transition-all hover:bg-purple-800 focus:bg-purple-800 active:bg-purple-800"
                            >
                                address
                            </div>
                            <div
                                role="button"
                                className="truncate text-sm text-white flex w-full min-h-4 items-center rounded-md p-1 transition-all hover:bg-purple-800 focus:bg-purple-800 active:bg-purple-800"
                            >
                                address
                            </div>

                            <div
                                role="button"
                                className="truncate text-sm text-white flex w-full min-h-4 items-center rounded-md p-1 transition-all hover:bg-purple-800 focus:bg-purple-800 active:bg-purple-800"
                            >
                                address
                            </div>
                            <div
                                role="button"
                                className="truncate text-sm text-white flex w-full min-h-4 items-center rounded-md p-1 transition-all hover:bg-purple-800 focus:bg-purple-800 active:bg-purple-800"
                            >
                                address
                            </div>
                            <div
                                role="button"
                                className="truncate text-sm text-white flex w-full min-h-4 items-center rounded-md p-1 transition-all hover:bg-purple-800 focus:bg-purple-800 active:bg-purple-800"
                            >
                                address
                            </div>

                            <div
                                role="button"
                                className="truncate text-sm text-white flex w-full min-h-4 items-center rounded-md p-1 transition-all hover:bg-purple-800 focus:bg-purple-800 active:bg-purple-800"
                            >
                                address
                            </div>
                            <div
                                role="button"
                                className="truncate text-sm text-white flex w-full min-h-4 items-center rounded-md p-1 transition-all hover:bg-purple-800 focus:bg-purple-800 active:bg-purple-800"
                            >
                                address
                            </div>
                            <div
                                role="button"
                                className="truncate text-sm text-white flex w-full min-h-4 items-center rounded-md p-1 transition-all hover:bg-purple-800 focus:bg-purple-800 active:bg-purple-800"
                            >
                                address
                            </div>

                            <div
                                role="button"
                                className="truncate text-sm text-white flex w-full min-h-4 items-center rounded-md p-1 transition-all hover:bg-purple-800 focus:bg-purple-800 active:bg-purple-800"
                            >
                                address
                            </div>
                            <div
                                role="button"
                                className="truncate text-sm text-white flex w-full min-h-4 items-center rounded-md p-1 transition-all hover:bg-purple-800 focus:bg-purple-800 active:bg-purple-800"
                            >
                                here
                            </div>
                        </nav>
                    </div>
                </div>
    
                <div className="w-full flex flex-col gap-3">
                    <button
                        onClick={onClose}
                        className="bg-purple-500 hover:bg-purple-400 active:bg-purple-600 px-4 py-2 rounded-lg text-white uppercase"
                    >
                        ok
                    </button>
                </div>
            </div>
            </div>
        </div>
    )
}