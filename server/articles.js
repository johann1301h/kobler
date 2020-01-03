import { LoremIpsum } from "lorem-ipsum";

function win_rate() {
  let number = 100*Math.random();
  number = number.toFixed(0) + "%";
  return number;
}

function bids() {
  let number = 10000*Math.random();
  number = number.toFixed(0);
  return number;
}

function spending() {
  let number = 1000*Math.random();
  number = 'kr ' + number.toFixed(0);
  return number;
}

function click() {
  let number = 10*Math.random();
  number = number.toFixed(0);
  return number;
}

function ctr() {
  let number = 1*Math.random();
  number = number.toFixed(2) + "%";
  return number;
}

function randomNumber(a, b) {
  return Math.floor(Math.random() * (b - a) ) + a;
}

function published() {
  let day = randomNumber(1,32).toString(10);
  let month = randomNumber(1,13).toString(10);
  const year = randomNumber(2013,2021).toString(10);

  if (day.length === 1) {
    day = '0' + day;
  }

  if (month.length === 1) {
    month = '0' + month;
  }

  const fullDate = day + '.' + month + '.' + year;

  return fullDate;
}



const lorem = new LoremIpsum({
  sentencesPerParagraph: {
    max: 8,
    min: 4
  },
  wordsPerSentence: {
    max: 4,
    min: 2,
  }
});

let row = {};
let table = [];
for (let i = 0; i < 74; i++) {
  row = {
    title: {content: lorem.generateWords(2), website: 'https://www.vg.no'},
    published: published(),
    site: lorem.generateWords(1),
    ad_group: {content: lorem.generateWords(3), website: 'https://www.vg.no'},
    bids: bids(),
    spending: spending(),
    win_rate: win_rate(),
    impressions: bids(),
    click: click(),
    ctr: ctr(),
  }
  table.push(row);
}

export default table
