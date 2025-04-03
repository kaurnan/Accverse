import { PublicClientApplication, AuthenticationResult, Configuration, InteractionRequiredAuthError } from '@azure/msal-browser';

// Microsoft Azure AD configuration - using consumers endpoint
const msalConfig = {
  auth: {
    clientId: `80650cbb-cbb0-4f9f-bc8e-dd914007068b`,
    authority: `https://login.microsoftonline.com/consumers`, // Changed to consumers
    redirectUri: window.location.origin,
  }
};

// Microsoft Graph API endpoints
const graphConfig = {
  graphMeEndpoint: "https://graph.microsoft.com/v1.0/me"
};

// Authentication parameters for Microsoft Identity platform
const loginRequest = {
  scopes: [
    "User.Read", 
    "Calendars.ReadWrite",
    "OnlineMeetings.ReadWrite"
  ]
};

// Initialize MSAL instance
const msalInstance = new PublicClientApplication(msalConfig as Configuration);

// Initialize MSAL before using it
await msalInstance.initialize();

// Handle redirect promise to complete login if in progress
msalInstance.handleRedirectPromise().catch(error => {
  console.error("Redirect handling error:", error);
});

// Function to login with Microsoft
export const loginWithMicrosoft = async () => {
  try {
    // Login with prompt to select account
    const response: AuthenticationResult = await msalInstance.loginPopup({
      ...loginRequest,
      prompt: "select_account" // Force account selection
    });
    console.log("Login successful", response);
    
    // Get token silently
    const tokenResponse = await msalInstance.acquireTokenSilent({
      ...loginRequest,
      account: msalInstance.getAllAccounts()[0]
    });
    
    return {
      token: tokenResponse.accessToken,
      user: {
        id: response.uniqueId,
        name: response.account?.name || 'Microsoft User',
        email: response.account?.username || '',
        provider: 'microsoft'
      }
    };
  } catch (error: any) {
    // If silent token acquisition fails, try interactive method
    if (error instanceof InteractionRequiredAuthError) {
      try {
        const response = await msalInstance.acquireTokenPopup({
          ...loginRequest,
          prompt: "select_account" // Force account selection
        });
        return {
          token: response.accessToken,
          user: {
            id: response.uniqueId,
            name: response.account?.name || 'Microsoft User',
            email: response.account?.username || '',
            provider: 'microsoft'
          }
        };
      } catch (interactiveError: any) {
        console.error("Interactive token acquisition failed:", interactiveError);
        
        // Handle specific error code for unauthorized_client
        if (interactiveError.errorCode === "unauthorized_client") {
          throw new Error(
            "This application is not configured for personal Microsoft accounts. Please use a work or school account, " +
            "or contact the administrator to enable personal accounts for this application."
          );
        }
        
        throw interactiveError;
      }
    }
    
    // Handle specific error code for unauthorized_client
    if (error.errorCode === "unauthorized_client") {
      throw new Error(
        "This application is not configured for personal Microsoft accounts. Please use a work or school account, " +
        "or contact the administrator to enable personal accounts for this application."
      );
    }
    
    console.error("Microsoft login error:", error);
    throw error;
  }
};

// Function to logout from Microsoft
export const logoutFromMicrosoft = async () => {
  try {
    const logoutRequest = {
      account: msalInstance.getAllAccounts()[0],
      postLogoutRedirectUri: window.location.origin
    };
    
    await msalInstance.logoutPopup(logoutRequest);
  } catch (error) {
    console.error("Microsoft logout error:", error);
    throw error;
  }
};

export default msalInstance;
export { graphConfig, msalConfig, loginRequest };
