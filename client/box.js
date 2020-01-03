class Box {
  constructor() {
    this.boxNode = document.querySelector('#box');
    this.closeBoxNode = document.querySelector('#closeBox');
    this.cancelNode = document.querySelector('#cancel');
    this.formNode = document.querySelector('#createNewForm');
    this.inputs = [
      'title',
      'published',
      'site',
      'ad_group',
      'bids',
      'spending',
      'win_rate',
      'impressions',
      'clicks',
      'ctr',
    ];
    this.validate = this.createValidationObject();
  }

  createValidationObject() {
    const object = {};
    let name, node;
    for (let i in this.inputs) {
      name = this.inputs[i];
      object[name] = {};
      object[name]['node'] = this.formNode.querySelector(`[name=${name}]`);
      object[name]['before'] = object[name]['node'].dataset.addBefore;
      object[name]['after'] = object[name]['node'].dataset.addAfter;
      object[name]['type'] = object[name]['node'].dataset.type;
    }
    return object;
  }

  addCreateNewCallbackListener(func) {
    const funcExtended = (event) => {
      event.preventDefault();
      this.createNew(event, func);
    }
    this.formNode.addEventListener('submit', funcExtended);
  }

  addCloseListener(func) {
    const funcExtended = (event) => {
      event.preventDefault();
      func(event);
    }
    this.closeBoxNode.addEventListener('click', funcExtended);
    this.cancelNode.addEventListener('click', funcExtended);
  }

  showBox() {
    this.clearForm();
    this.boxNode.style.display = 'block';
  }

  hideBox() {
    this.boxNode.style.display = 'none';
  }

  send(data, callback) {
    const myRequest = new XMLHttpRequest();
    myRequest.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
        callback();
      }
    }
    myRequest.open("POST", "/send", true);
    myRequest.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    myRequest.send(`data=${data}`);
  }

  setWarning(element) {
    element.style.backgroundColor = '#FEFFF3';
    element.style.borderColor = '#FFA0A0';
  }

  removeWarning(element) {
    element.style.backgroundColor = '';
    element.style.borderColor = '';
  }

  clearForm() {
    let input, node;
    for (let key in this.validate) {
      input = this.validate[key];
      node = input.node;
      node.value = '';
      this.removeWarning(node);
    }
  }

  checkDateFormat(date) {
    return date.match(/^(\d{1,2}).(\d{1,2}).(\d{4})$/);
  }

  collectForm() {
    let input, before, after, type, node, value;
    const valueObject = {};
    let success = true;
    for (let key in this.validate) {
      input = this.validate[key];
      before = input.before;
      after = input.after;
      type = input.type;
      node = input.node;
      value = node.value;
      this.removeWarning(node);

      // check if value exists
      if (!value) {
        this.setWarning(node);
        success = false;
      }

      // check not empty string
      if (value.trim() === '') {
        this.setWarning(node);
        success = false;
      }

      // check against number type
      if (type === 'number') {
        if ( isNaN(parseInt(value)) ) {
          this.setWarning(node);
          success = false;
        }
      }

      // check against date type and reformat
      if (type === 'date') {
        if (!this.checkDateFormat(value)) {
          this.setWarning(node);
          success = false;
        }
      }

      // trim value
      value = value.trim();

      // set before
      if (before) {
        value = before + value;
      }

      // set after
      if (after) {
        value = value + after;
      }

      // store value in object
      valueObject[key] = value;

    }
    return [success, valueObject];
  }

  createNew(event, func) {
    const result = this.collectForm();
    const success = result[0];
    if (success) {
      const data = result[1];
      const toSend = {
        title: {content: data.title, website: 'https://www.vg.no'},
        published: data.published,
        site: data.site,
        ad_group: {content: data.ad_group, website: 'https://www.vg.no'},
        bids: data.bids,
        spending: data.spending,
        win_rate: data.win_rate,
        impressions: data.impressions,
        click: data.clicks,
        ctr: data.ctr,
      }
      const toSendString = JSON.stringify(toSend);
      this.send(toSendString, () => { func() });
    }
  }

}

export default Box;
