export interface ILoginResponse {
  token: string;
  accessToken: string;
  refreshToken: string;
  user: {
    needpasswordChange: boolean;
    email: string;
    name: string;
    role: string;
    profilePhoto: string;
    emailVerified: boolean;
    image?: string;
    status: string;
    isDeleted: boolean;
  };
}


export interface IRegisterResponse {
  token?: string;
  accessToken?: string;
  refreshToken?: string;
  user: {
    email: string;
    name: string;
    role: string;
    profilePhoto?: string;
    emailVerified: boolean;
    image?: string;
    status: string;
    isDeleted: boolean;
  };
}
