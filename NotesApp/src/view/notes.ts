import { autoinject, Aurelia } from 'aurelia-framework';
import {HttpClient, json, HttpClientConfiguration} from 'aurelia-fetch-client';
import {Note} from './../models/note';
import {User} from './../models/user';
import {Category} from './../models/category';

@autoinject
export class notes {
  httpClient: HttpClient;

  notes = new Array<Note>();
  cat = new Array<Category>();
  user = new Array<User>();
  index = 1;

  selectedId : number = null;
  selectedTitle : string = null;
  selectedNote : string = null;
  selectedCat: number = null;
  selectedU: number = null;

  now = new Date();
  newNote = new Note("", "", "", "", "", "", "", new Category("", ""), new User("", "", "", this.now));

  constructor(httpClient: HttpClient) {
    httpClient.configure(config => {
      config
        .withBaseUrl('https://lbnotes.azurewebsites.net/api/')
        .withDefaults({
          headers: {
            'Content-Type': 'application/json',
          }});
    });
    this.httpClient = httpClient;

    this.getNotes();
    this.dropdown();
  }

 // Dropdown methods
  dropdown() {
    this.upCat();
    this.upUser();
  }

  // Update category dropdown box
  upCat() {
    this.cat = new Array<Category>();
    this.httpClient.fetch('category', {
      method: 'GET'
    })
      .then(response => response.json())
      .then(data => {
        for(let c of data) {
          var cat = new Category(c.id, c.name);
          var result = false;

          for(var c of this.cat) {
            if(c.id == cat.id) {
              result = false;
            }
          }

          if(result == false) {
            this.cat.push(cat);
          }}});
  }

  // Update user dropdown box
  upUser() {
    this.user = new Array<User>();
    this.httpClient.fetch('user', {
      method: 'GET'
    })
      .then(response => response.json())
      .then(note => {
        for(let u of note) {
          var user = new User(u.id, u.name, u.email, u.createdOn);
          var result = false;

          for(var u of this.user) {
            if(u.id == user.id) {
              result = false;
            }
          }

          if(result == false) {
            this.user.push(user);
          }}});
  }

  // Get
  async getNotes() {
    console.log("GET called");
    this.notes = new Array<Note>();
    this.httpClient.fetch('notes', {
      method: 'GET'
    })
      .then(response => response.json())
      .then(notes => {
        for(let n of notes) {
          var user = new User(n.user.id, n.user.name, n.user.email, n.user.createdOn);
          var cat = new Category(n.category.id, n.category.name);
          var note = new Note(n.id, n.title, n.note, n.createdOn, n.categoryid, n.isDeleted, n.userid, cat, user);
          this.notes.push(note);
          this.index = note.id + 1;
        }
      })
  }

  // Adds a note
  putNote() {
    if(this.newNote.id == null || this.newNote.title == null || this.newNote.note == null || this.selectedCat == null || this.selectedU == null) {
      alert("Error!: Invalid input");
    }
    else {
      this.newNote.category = this.cat[this.selectedCat - 1];
      this.newNote.user = this.user[this.selectedU - 1];
      this.newNote.createdOn = this.now;
      this.newNote.categoryid = this.newNote.category.id;
      this.newNote.isDeleted = false;
      this.newNote.userid = this.newNote.user.id;

      let exists = false;

      for(let n of this.notes) {
        if(n.id == this.newNote.id) {
          exists = true;
        }
      }

       
      if(exists)
      {
        console.log("PUT called");
        this.httpClient.fetch('notes/' + this.newNote.id, {
          method: 'PUT',
          body: JSON.stringify(this.newNote),
        })
        .then(note => {
          console.log(note);
          {
            this.getNotes();
          }
       });
      }
      else 
      { 
        // POST 
        console.log("POST called");
        this.httpClient.fetch('notes', {
          method: 'POST',
          body: JSON.stringify(this.newNote),
        })
        .then(data => {
          console.log(data);
          if(data.status == 200)
          {
            this.getNotes();
          }
       });
      }
      
    }
  }

  // Delete
  deleteNote(id) {
    console.log("DELETE called on Note: " + id);
    console.log(this.httpClient.baseUrl + 'notes/' + id);
    this.httpClient.fetch('notes/' + id, {
      method: 'DELETE'
    })
    .then(note => {
      console.log(note);
      if(note.status == 200)
      {
        this.getNotes();
      }
    });
  }

  // Refresh button
  refreshPage() {
    window.location.reload();
  }
}
