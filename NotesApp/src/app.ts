import { Router, RouterConfiguration } from 'aurelia-router';

export class App {
  router: Router;

  constructor() { }

  configureRouter(config: RouterConfiguration, router: Router) {
    config.title = 'NotesApp';
    config.map([
      { route: ['', 'home'], name: 'home', moduleId: 'index', title: 'Home' },
      { route: '/user', name: 'user', moduleId: './view/user', title: 'User' },
      { route: '/category', name: 'category', moduleId: './view/category', title: 'Category' },
      { route: '/notes', name: 'notes', moduleId: './view/notes', title: 'Notes' }
    ]);

    config.fallbackRoute('home');

    this.router = router;
  }
}
