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
          <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
            Sign In Required
          </h2>
          <p className="mb-6 text-gray-700 dark:text-gray-200 text-center">
            Unfortunately, you&apos;re not signed in, and your progress will be
            lost. Fear not, you can save your progress as a JSON file before
            signing in to preserve your work.
          </p>
          <div className="w-full">
            <SignInForm onSuccess={onClose} />
          </div>
          <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-600 dark:text-gray-400 text-center mb-4">
              Don&apos;t have an account?
            </p>
            <a
              href="/auth/signup"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2 px-4 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded font-semibold hover:bg-gray-200 dark:hover:bg-gray-600 transition text-center block"
            >
              Create Account
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
