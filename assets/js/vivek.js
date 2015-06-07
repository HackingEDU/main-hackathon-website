  var w = c.width = window.innerWidth,
  h = c.height = window.innerHeight,
  ctx = c.getContext('2d'),

  spawnProb = 1,
  numberOfMoves = [8, 16], //[min, max]
  distance = [50, 200],
  attenuator = 900,
  timeBetweenMoves = [6, 10],
  size = [.5, 3],

  lines = [],
  frame = (Math.random() * 360) | 0;

function rand(ar) {
  return Math.random() * (ar[1] - ar[0]) + ar[0];
}

function Line() {
  this.x = Math.random() * w;
  this.y = Math.random() * h;
  this.vx = this.vy = 0;
  this.last = {};
  this.target = {};
  this.totalMoves = rand(numberOfMoves);
  this.move = 0;
  this.timeBetweenMoves = rand(timeBetweenMoves);
  this.timeSpentThisMove = this.timeBetweenMoves;
  this.distance = rand(distance);

  this.color = 'hsl(hue, 80%, 50%)'.replace('hue', frame % 360);

  this.size = rand(size);
}
Line.prototype.use = function() {
  ++this.timeSpentThisMove;
  if (this.timeSpentThisMove >= this.timeBetweenMoves) {
    ++this.move;
    this.timeSpentThisMove = 0;

    var rad = Math.random() * 2 * Math.PI;
    this.target.x = this.x + Math.cos(rad) * this.distance;
    this.target.y = this.y + Math.sin(rad) * this.distance;
  }

  this.last.x = this.x;
  this.last.y = this.y;

  this.vx += (this.x - this.target.x) / attenuator;
  this.vy += (this.y - this.target.y) / attenuator;

  this.x += this.vx;
  this.y += this.vy;

  ctx.lineWidth = this.size;
  ctx.strokeStyle = ctx.shadowColor = this.color;
  ctx.beginPath();
  ctx.moveTo(this.last.x, this.last.y);
  ctx.lineTo(this.x, this.y);
  ctx.stroke();
}

function anim() {
  window.requestAnimationFrame(anim);

  ++frame;

  ctx.shadowBlur = 0;
  ctx.fillStyle = 'rgba(0, 0, 0, .04)';
  ctx.fillRect(0, 0, w, h);
  ctx.shadowBlur = 20;

  if (Math.random() < spawnProb) lines.push(new Line);

  for (var i = 0; i < lines.length; ++i) {
    lines[i].use();

    if (lines[i].move >= lines[i].totalMoves) {
      lines.splice(i, 1);
      --i;
    }
  }
}
anim();