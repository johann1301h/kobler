class Table {

  constructor() {

    // dom element nodes
    this.sortersNodeList = document.querySelectorAll("[id^='sort']");
    this.loadMoreNode = document.querySelector('#loadMore');
    this.tableNode = document.querySelector("#table");
    this.createNewNode = document.querySelector('#createNew');

    this.sortIndex = 'title';
    this.loaded = 0;
    this.sortOrder = 1;
    this.table = [];
    this.columns = [
      'title',
      'published',
      'site',
      'ad_group',
      'bids',
      'spending',
      'win_rate',
      'impressions',
      'click',
      'ctr',
    ];

    // event listeners to table
    this.loadMoreNode.addEventListener('click', () => {
      this.load(2);
    });

    this.sortersNodeList.forEach(element => {
      element.addEventListener('click', this.sortClickHandler.bind(this));
    });

  }

  showTable() {
    this.tableNode.style.display = 'table';
  }

  hideTable() {
    this.tableNode.style.display = 'none';
  }

  addCreateNewListener(func) {
    this.createNewNode.addEventListener('click', func);
  }

  sortClickHandler(event) {
    const element = event.target;
    const sortIndex = element.id.replace('sort_','');
    const sortOrder = this.orderRulette(element.dataset.order);
    this.sort(sortIndex, sortOrder);
    this.update();
  }

  orderRulette(order) {
    return (-1)*parseInt(order);
  }

  setOrder(element, order) {
    element.dataset.order = order;
  }

  setSortBackground(element, sortOrder) {
    let styleString;

    if (sortOrder === -1) {
      styleString = 'url("sortDown.svg")';
    } else if (sortOrder === 0) {
      styleString = 'url("sortNone.svg")';
    } else if (sortOrder === 1) {
      styleString = 'url("sortUp.svg")';
    }

    element.style.backgroundImage = styleString;
  }

  load(n) {
    this.fetch(this.loaded + n)
  }

  fetch(n) {
    if (!Number.isInteger(n)) {
      alert('Must provide integer to fetch method!');
      return;
    }
    const myRequest = new XMLHttpRequest();
    const instance = this;
    function onReadyStateChangeFunction() {
      if (this.readyState == 4 && this.status == 200) {
        instance.table = [];
        const result = JSON.parse(this.response);
        instance.table.push(...result[0]);
        instance.loaded = n;
        instance.total = result[1];
        instance.sort(instance.sortIndex, instance.sortOrder);
        instance.update();
      }
    }
    myRequest.onreadystatechange = onReadyStateChangeFunction;
    myRequest.open('GET', '/articles/' + n);
    myRequest.send();
  }

  sort(index,order) {

    this.table.sort((a,b) => {

      let first = (a[index].content) ? a[index].content : a[index];
      let last = (b[index].content) ? b[index].content : b[index];

      let compareNumbers = this.columns.indexOf(index) > 3;

      if (index === 'published') {
        const firstList = first.split('.');
        const lastList = last.split('.');
        const firstDay = parseFloat(firstList[0]);
        const lastDay = parseFloat(lastList[0]);
        const firstMonth = parseFloat(firstList[1]);
        const lastMonth = parseFloat(lastList[1]);
        const firstYear = parseFloat(firstList[2]);
        const lastYear = parseFloat(lastList[2]);
        if (firstYear !== lastYear) {
          return firstYear - lastYear;
        } else if (firstMonth !== lastMonth) {
          return firstMonth - lastMonth;
        } else {
          return firstDay - lastDay;
        }
      } else if (compareNumbers) {
        first = first.replace('kr', '').trim();
        last = last.replace('kr', '').trim();
        return parseFloat(first) - parseFloat(last);
      } else {
        first = first.toUpperCase();
        last = last.toUpperCase();

        if (first < last) {
          return -1;
        }
        if (first > last) {
          return 1;
        }
        return 0;
      }
    });

    if (order === -1) {
      this.table.reverse();
    }

    this.sortIndex = index;
    this.sortOrder = order;

  }

  update() {
    this.showTable();
    let tr,html,link,insert;
    const firstHeader = this.tableNode.querySelector('tr:nth-child(1)');
    const secondHeader = this.tableNode.querySelector('tr:nth-child(2)');
    const childNodes = [firstHeader,secondHeader];
    for (let i = 0; i < this.table.length; i++) {
      tr = document.createElement('tr');
      html = ``;
      for (let k = 0; k < this.columns.length; k++) {
        insert = this.table[i][this.columns[k]];
        if (insert.content) {
          html += `<td><a href='${insert.website}'>${this.table[i][this.columns[k]].content}</a></td>`;
        } else {
          html += `<td>${this.table[i][this.columns[k]]}</td>`;
        }
      }
      tr.innerHTML = html;
      childNodes.push(tr);
      html = ``;
    }
    const lastRow = this.tableNode.querySelector('tr:last-child');
    lastRow.querySelector('#loaded').innerHTML = this.loaded;
    lastRow.querySelector('#total').innerHTML = this.total;
    childNodes.push(lastRow);
    this.tableNode.innerHTML = '';
    this.tableNode.append(...childNodes);

    this.sortersNodeList.forEach(element => {

      if (element.id.replace('sort_','') === this.sortIndex) {
        this.setSortBackground(element, this.sortOrder);
        this.setOrder(element, this.sortOrder);
      } else {
        this.setSortBackground(element, 0);
        this.setOrder(element, -1);
      }
    });

  }

}

export default Table;
