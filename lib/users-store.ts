import bcrypt from "bcryptjs";

export type DemoUser = {
  id: string;
  email: string;
  passwordHash: string;
  firstName: string;
  lastName: string;
};

const users: DemoUser[] = [
  {
    id: "demo-1",
    email: "richard@cajkorenikava.cz",
    // heslo: "heslo123"
    passwordHash: bcrypt.hashSync("heslo123", 10),
    firstName: "Richard",
    lastName: "Demo",
  },
];

export function findUserByEmail(email: string) {
  return users.find((u) => u.email.toLowerCase() === email.toLowerCase());
}

export function createUser(data: {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}) {
  if (findUserByEmail(data.email)) {
    throw new Error("Uživatel s tímto e-mailem už existuje");
  }
  const user: DemoUser = {
    id: `user-${users.length + 1}`,
    email: data.email,
    passwordHash: bcrypt.hashSync(data.password, 10),
    firstName: data.firstName,
    lastName: data.lastName,
  };
  users.push(user);
  return user;
}
