import { PublicClientApplication, AuthenticationResult, Configuration, InteractionRequiredAuthError } from '@azure/msal-browser';

// Microsoft Azure AD B2C configuration
const msalConfig = {
  auth: {
    clientId: `80650cbb-cbb0-4f9f-bc8e-dd914007068b`,
    authority: `https://login.microsoftonline.com/2fe7c53d-6768-4c09-a9b7-9626d76fdc7c`,
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
    // Login
    const response: AuthenticationResult = await msalInstance.loginPopup(loginRequest);
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
  } catch (error) {
    // If silent token acquisition fails, try interactive method
    if (error instanceof InteractionRequiredAuthError) {
      try {
        const response = await msalInstance.acquireTokenPopup(loginRequest);
        return {
          token: response.accessToken,
          user: {
            id: response.uniqueId,
            name: response.account?.name || 'Microsoft User',
            email: response.account?.username || '',
            provider: 'microsoft'
          }
        };
      } catch (interactiveError) {
        console.error("Interactive token acquisition failed:", interactiveError);
        throw interactiveError;
      }
    }
    console.error("Microsoft login error:", error);
    throw error;
  }
};

// Function to logout from Microsoft
export const logoutFromMicrosoft = async () => {
  try {
    const logoutRequest = {
      account: msalInstance.getAllAccounts()[0]
    };
    
    await msalInstance.logoutPopup(logoutRequest);
  } catch (error) {
    console.error("Microsoft logout error:", error);
    throw error;
  }
};

export default msalInstance;
export { graphConfig, msalConfig, loginRequest };