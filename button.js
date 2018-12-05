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

  drawRect() {
    strokeWeight(1);
    rectMode(CORNER);
    fill(this.c);
    rect(this.x, this.y, this.w, this.h);
  }

  drawContent() {
    textAlign(CENTER, CENTER);
    fill(0);
    text(this.text, this.x + this.w / 2, this.y + this.h / 2);
  }

  show() {
    this.drawRect();
    this.drawContent();
  }
}

class Image_Button extends Button {
  constructor(text, x, y, w, h, c, image) {
    super(text, x, y, w, h, c);
    this.image = image;
  }

  drawContent() {
    image(this.image, this.x + this.w * 0.2, this.y + this.h * 0.1, this.w * 0.6, this.h * 0.6);
    textAlign(CENTER, CENTER);
    fill(0);

    let size = textSize();
    while (true) {
      if (textWidth(this.text) < this.w - 10) {
        break;
      }
      size--;
      textSize(size);
    }

    text(this.text, this.x + this.w / 2, this.y + this.h * 0.85);
  }
}