import Clients from './clients.js';
import Overlay from './overlay.js';
import Box from './box.js';
import Table from './table.js';

const clients = new Clients();
const overlay = new Overlay();
const box = new Box();
const table = new Table();

clients.listen(1000);

overlay.addClickListener(() => {
  box.hideBox();
  overlay.hideOverlay();
});

box.addCloseListener(() => {
  box.hideBox();
  overlay.hideOverlay();
});

box.addCreateNewCallbackListener(() => {
  const plusOne = table.loaded + 1;
  table.fetch(plusOne);
  box.hideBox();
  overlay.hideOverlay();
});

table.fetch(4);
table.addCreateNewListener(() => {
  box.showBox();
  overlay.showOverlay();
});
