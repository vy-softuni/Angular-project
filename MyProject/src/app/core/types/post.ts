export interface IPost {
  _id: string;
  title: string;
  content: string;
  imageUrl: string;
  _ownerId: string;
  likes: string[]; // Array of user IDs who liked the post
}