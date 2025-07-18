import React from "react";
import SignInForm from "@/app/auth/signin/components/signin-form";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-md w-full overflow-hidden border border-gray-200 dark:border-gray-700 relative">
        <button
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 text-xl"
          onClick={onClose}
          aria-label="Close"
        >
          &times;
        </button>
        <div className="p-8 flex flex-col items-center">
          <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Sign In Required</h2>
          <p className="mb-6 text-gray-700 dark:text-gray-200 text-center">
            You must be signed in to perform this action. Please sign in to continue.
          </p>
          <div className="w-full">
            <SignInForm onSuccess={onClose} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
