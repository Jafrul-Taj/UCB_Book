export type user = {
  id: number;
  displayName: string;
  email: string;
  token: string;
  imageUrl?: string;
};

export type loginCreds = {
  email: string;
  password: string;
};

export type RegisterCreds = {
  email: string;
  displayName: string;
  password: string;
};