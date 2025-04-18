import "./style.scss";

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
}
  
export default function Modal({ isOpen, onClose }: ModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-purple-900 rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex flex-col items-center">
            <h2 className="text-2xl font-bold mb-4 text-white">Demo</h2>
            <p className="text-center mb-6 text-white">
                For investor inquiries contact<br />
                MikeGao<br />
            </p>
            <button 
                onClick={onClose} 
                className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg text-white"
            >
                Close
            </button>
            </div>
        </div>
        </div>
    );
}