class Button {
  constructor(text, x, y, w, h, c) {
    this.text = text;
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.c = c;
  }

  contains(px, py) {
    return px >= this.x && px < this.x + this.w && py >= this.y && py < this.y + this.h;
  }

  show() {
    rectMode(CORNER);
    strokeWeight(1);
    textAlign(CENTER, CENTER);

    fill(this.c);
    rect(this.x, this.y, this.w, this.h);

    fill(0);
    text(this.text, this.x + this.w / 2, this.y + this.h / 2);
  }
}