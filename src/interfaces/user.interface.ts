import { Forum } from './forum.interface';

export interface User {
  id: string;
  name: string;
  picture?: string;
  forums: Forum[];
}
