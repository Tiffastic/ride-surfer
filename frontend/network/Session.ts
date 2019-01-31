// so gross, lol
let currentUser: User | null = null;

export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  carPlate: string;
  carMake: string;
  carModel: string;
  carYear: number;
}

export function getCurrentUser(): User {
  if (currentUser === null) {
    throw new Error("tried to get null currentUser");
  }

  return currentUser;
}

export function setCurrentUser(user: User) {
  currentUser = user;
}
