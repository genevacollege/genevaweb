// var wall = new Freewall('#freewall');
// wall.reset({
//   selector: '.brick',
//   animate: true,
//   cellW: 200,
//   cellH: 'auto',
//   onResize: function () {
//     wall.fitWidth();
//   }
// });

// wall.container.find('.brick img').load(function () {
//   wall.fitWidth();
// });

$(function () {
  var wall = new Freewall('#grid');
  wall.reset({
    selector: '.item',
    animate: true,
    // cellW: 200,
    cellH: 'auto',
    onResize: function () {
      wall.fitWidth();
    }
  });

  wall.fitWidth();

  $('#addBlock').click(function () {
    wall.appendBlock(`<div class="item item1">1</div>`);
    wall.appendBlock(`<div class="item item2">2</div>`);
    wall.appendBlock(`<div class="item item3">3</div>`);
    wall.appendBlock(`<div class="item item4">4</div>`);
    wall.appendBlock(`<div class="item item5">5</div>`);
    wall.appendBlock(`<div class="item item6">6</div>`);
  });
});
