import {autoinject} from 'aurelia-framework';
import {HttpClient, json} from 'aurelia-fetch-client';
import {User} from './../models/user';

@autoinject
export class user {
  users = new Array<User>();
  newUser = new User("", "", "", "");
  now = new Date();
  index = 1;

  constructor(private httpClient: HttpClient) {
    httpClient.configure(config => {
      config
        .withBaseUrl('http://lbnotes2.azurewebsites.net/api/')
        .withDefaults({
          headers: {
            'Content-Type': 'application/json',
          }});
    });

    this.getUser();
  }

  

  // Gets users
 public async getUser() {
    console.log("GET called");
    this.users = new Array<User>();
    this.httpClient.fetch('user', {
      method: 'GET'
    })
      .then(response => response.json())
      .then(users => {
        for(let u of users) {
          var user = new User(u.id, u.email, u.name, u.createdOn);
          this.users.push(user);
          this.index = user.id + 1;
        }
      });
  }

  // Adds user
  putUser() {
    this.newUser.createdOn = this.now;

    
      let exists = false;
      
      for(let u of this.users) {
        if(u.id == this.newUser.id) {
          exists = true;
        }

        if(exists) {
          console.log("PUT called");
          this.httpClient.fetch('user/' + this.newUser.id, {
            method: 'PUT',
            body: JSON.stringify(this.newUser)
          })
          .then(user => {
            console.log(user);
            if(user.status == 200)
            {
              this.getUser();
            }
          });
        }
        else {
          console.log("POST called");
          this.httpClient.fetch('user', {
            method: 'POST',
            body: JSON.stringify(this.newUser)
          })
          .then(user => {
            console.log(user);
            if(user.status == 200)
            {
              this.getUser();
            }
          });
        }
      }
    }
  

  // Delete user
  deleteUser(id) {
    console.log("DELETE called on User: " + id);
    this.httpClient.fetch('user/' + id, {
      method: 'DELETE'
    })
    .then(user => {
        console.log(user);
        if(user.status == 200)
        {
          this.getUser();
        }
     });
  }

  // Refresh button (located in infotag)
  refreshPage() {
    window.location.reload();
  }
}
