import { User } from './user.interface';

export interface Message {
  id: string;
  text: string;
  forumId: string;
  user: User;
  createdAt: string;
}
