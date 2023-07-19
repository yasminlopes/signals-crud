import { Task } from "../../tasks/models/task.model";

export interface User {
  id: number;
  name: string;
  email: string;
  gender: 'M' | 'F';
  tasks: Task[];
}
