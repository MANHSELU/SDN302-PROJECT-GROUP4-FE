export interface Review {
  _id: string;
  user_id: {
    _id: string;

    fullname: string;
    avatar?: string;
  };
  text: string;
  rating: number;
  createdAt: string;
}
