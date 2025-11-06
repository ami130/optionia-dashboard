const isDevelopment: boolean = process.env.NODE_ENV === "development";

const productionUrl: string = "https://optionia-backend.onrender.com";
// const productionUrl: string = "http://localhost:3000";

const localUrl: string = "https://optionia-backend.onrender.com"; // A

export const baseUrl: string = isDevelopment ? localUrl : productionUrl;

export const TOKEN_NAME: string = "access";
