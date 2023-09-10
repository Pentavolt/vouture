import { ReactNode, createContext, useContext, useState } from "react";

interface RegisterData {
  email?: string;
  username?: string;
  password?: string;
  birthday?: Date;
}

export type RegisterContextType = {
  data: RegisterData | undefined;
  update: (data: RegisterData) => void;
};

export const RegisterContext = createContext<RegisterContextType>(
  {} as RegisterContextType
);

export const RegisterProvider = ({ children }: { children: ReactNode }) => {
  const [data, setData] = useState<RegisterData>();
  const update = (data: RegisterData) => {
    setData((curr) => ({ ...curr, ...data }));
  };

  return (
    <RegisterContext.Provider value={{ data, update }}>
      {children}
    </RegisterContext.Provider>
  );
};

export const useRegister = () => {
  return useContext(RegisterContext);
};
