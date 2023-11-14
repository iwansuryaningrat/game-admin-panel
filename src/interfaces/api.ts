interface UserMockProps {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  gender: string;
  dob: string;
}

interface MoviewMockProps {
  id: string;
  name: string;
  genre: string;
  rating: number;
}

interface UserMockResponse {
  data: UserMockProps[];
}

interface MoviewMockResponse {
  data: MoviewMockProps[];
}

export type {
  UserMockProps,
  UserMockResponse,
  MoviewMockProps,
  MoviewMockResponse,
};
