export class User {
  id: number;
  email: string;
  name: string;
  createdOn: Date;

  constructor(id, email, name, createdOn) {
    this.id = id;
    this.email = email;
    this.name = name;
    this.createdOn = new Date(createdOn);
  }
}
