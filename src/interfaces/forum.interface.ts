import { Message } from './message.interface';
import { User } from './user.interface';

export interface Forum {
  id: string;
  name: string;
  users: User[];
  messages: Message[];
}
