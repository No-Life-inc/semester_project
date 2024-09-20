export const Auth0Config = (env: { [key: string]: string | undefined }) => ({
    authRequired: false,
    auth0Logout: true,
    baseURL: env.BASE_URL || "http://localhost:5000",
    clientID: env.CLIENT_ID,
    issuerBaseURL: env.ISSUER_BASE_URL,
    secret: env.AUTH0_SECRET,
});