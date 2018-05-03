import { User } from './user';
import { Category } from './category';

export class Note {
  id: number;
  title: string;
  note: string;
  createdOn: Date;
  categoryid: number;
  isDeleted: boolean
  userid: number;
  category: Category;
  user: User;

  constructor(id, title, note, createdOn, categoryid, isDeleted, userid, category, user) {
    this.id = id;
    this.title = title;
    this.note = note;
    this.createdOn = new Date(createdOn);
    this.categoryid = categoryid;
    this.isDeleted = isDeleted;
    this.userid = userid;
    this.category = category;
    this.user = user;
  }
}
