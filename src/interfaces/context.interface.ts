import { Forum } from './forum.interface';
import { Message } from './message.interface';
import { User } from './user.interface';

export interface Context {
  users: User[];
  forums: Forum[];
  messages: Message[];
  default_user_id: string;
}
