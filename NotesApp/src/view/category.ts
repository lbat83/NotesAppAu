import {autoinject} from 'aurelia-framework';
import {HttpClient, json} from 'aurelia-fetch-client';
import {Category} from './../models/category';

@autoinject
export class category {
  category = new Array<Category>();
  newCat = new Category("", "");
  index = 1;

  constructor(private httpClient: HttpClient) {
    httpClient.configure(config => {
      config
        .withBaseUrl('https://lbnotes2.azurewebsites.net/api/')
        .withDefaults({
          headers: {
            'Content-Type': 'application/json',
          }});
    });

    this.getCat();
  }

  // Get Category
  async getCat() {
    console.log("GET called");
    this.category = new Array<Category>();
    this.httpClient.fetch('category', {
      method: 'GET'
    })
      .then(response => response.json())
      .then(data => {
        for(let c of data) {
          var cat = new Category(c.id, c.name);
          this.category.push(cat);
          this.index = cat.id + 1;
        }
      });
  }

  // Add Category
  putCat() {
    if(this.newCat.id == null || this.newCat.name == null) {
      alert("Error!: Invalid Entry.");
    }
    else {
      let exists = false;
      
      for(let c of this.category) {
        if(c.id == this.newCat.id) {
          exists = true;
        }

        if(exists) {
          console.log("PUT called");
          this.httpClient.fetch('category/' + this.newCat.id, {
            method: 'PUT',
            body: JSON.stringify(this.newCat)
          })
          .then(cat => {
            console.log(cat);
            if(cat.status == 200)
            {
              this.getCat();
            }
          });
        }
        else {
          console.log("POST called");
          this.httpClient.fetch('category', {
            method: 'POST',
            body: JSON.stringify(this.newCat)
          })
          .then(cat => {
            console.log(cat);
            if(cat.status == 200)
            {
              this.getCat();
            }
          });
        }
      }
    }
  }

  // Delete category
  deleteCat(id) {
    console.log("DELETE called on Category: " + id);
    this.httpClient.fetch('category/' + id, {
      method: 'DELETE'
    })
    .then(cat => {
      console.log(cat);
      if(cat.status == 200)
      {
        this.getCat();
      }
    });
  }

  // Refresh button (located in infotag)
  refreshPage() {
    window.location.reload();
  }
}
