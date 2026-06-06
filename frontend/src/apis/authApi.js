import { users } from "../data/users";

export const login = async (credentials) => {
  await new Promise((resolve) => setTimeout(resolve, 1000));

  const user = users.find(
    (user) =>
      user.email === credentials.email &&
      user.password === credentials.password,
  );

  if (!user) {
    throw new Error("Invalid email or password");
  }

  return user;
};
