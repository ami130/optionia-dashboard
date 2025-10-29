export type LoginTypes = {
  email: string;
  password: string;
};

export type UserType = {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  createdAt: string;
  updatedAt: string;
};

// export type LoginResponse = {
//   success: boolean;
//   access: string;
//   user?: UserType;
// };

export type LoginResponse = {
  success: boolean;
  message: string;
  access: string;
  refresh: string;
};

export type SendOTPTypes = {
  email: string;
};

export type MatchOTPTypes = {
  otp: string;
};

export type ForgotPasswordTypes = {
  newPassword: string;
  confirmNewPassword: string;
};

export type ErrorType = {
  status: string;
  data: {
    message: string;
  };
};
