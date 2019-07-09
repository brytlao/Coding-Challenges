class Ground extends Crate {
  constructor(x, y, w, h) {
    super(x, y, w, h);
    this.body.isStatic = true;
  }
}