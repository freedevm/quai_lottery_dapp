import Link from "next/link";
import "./style.scss";

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
}
  
export default function ConfirmModal({ isOpen, onClose }: ModalProps) {
    if (!isOpen) return null;

    const handleAttendWithNFT = () => {
        
    }

    const handleAttendWithTicket = () => {

    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-purple-900 rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex flex-col items-center">
                <h2 className="text-2xl font-bold mb-4 text-white">NFT Holder?</h2>
                <p className="text-center mb-6 text-white">
                    Are you a NFT holder and<br />
                    want to attend with your NFT(s)?<br />
                </p>
                <div className="flex gap-3">
                    <Link
                        href="/NFTBoost"
                        className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg text-white"
                    >Yes</Link>
                    <Link 
                        href="/Jackpot" 
                        className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg text-white"
                        >
                        No, with just one ticket
                    </Link>
                    <button 
                        onClick={onClose} 
                        className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg text-white"
                        >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
        </div>
    );
}