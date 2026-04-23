import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import AppContextProvider from "./context/AppContext.jsx"; 
import { BrowserRouter } from "react-router-dom";
import { ClerkProvider } from "@clerk/clerk-react";
import { FallbackAuthProvider } from "./components/auth/FallbackAuth";
import { UnifiedAuthProvider } from "./components/auth/UnifiedAuthProvider";

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

console.log("KEY:", PUBLISHABLE_KEY);

// Check if Clerk is properly configured
const useClerk = PUBLISHABLE_KEY && PUBLISHABLE_KEY !== 'your_clerk_publishable_key_here';

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    {useClerk ? (
      <ClerkProvider publishableKey={PUBLISHABLE_KEY} afterSignOutUrl="/">
        <FallbackAuthProvider>
          <UnifiedAuthProvider>
            <AppContextProvider>
              <App />
            </AppContextProvider>
          </UnifiedAuthProvider>
        </FallbackAuthProvider>
      </ClerkProvider>
    ) : (
      <FallbackAuthProvider>
        <UnifiedAuthProvider>
          <AppContextProvider>
            <App />
          </AppContextProvider>
        </UnifiedAuthProvider>
      </FallbackAuthProvider>
    )}
  </BrowserRouter>,
);
