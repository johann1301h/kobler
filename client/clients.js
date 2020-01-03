class Clients {
  constructor() {
    this.clientsNode = document.querySelector('#clients');
  }

  update() {
    const myRequest = new XMLHttpRequest();
    myRequest.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
        clients.innerHTML = 'Online users: ' + this.response;
      }
    }
    myRequest.open('GET', '/clients');
    myRequest.send();
  }

  listen(t) {
    setInterval(() => {
      this.update();
    }, t);
  }

}

export default Clients;
