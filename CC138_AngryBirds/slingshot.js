class SlingShot {
  constructor(x, y, l, body) {
    const options = {
      pointA: {
        x: x,
        y: y
      },
      bodyB: body,
      stiffness: 0.02,
      length: l
    }
    this.sling = Constraint.create(options);
    World.add(world, this.sling);
  }

  setStiffness(in_stiff) {
    this.sling.stiffess = in_stiff;
  }
  
  attach(body) {
    this.sling.bodyB = body;
  }

  detach() {
    this.sling.bodyB = null;
  }

  getDistCenter () {
    const diff_x = this.sling.pointA.x - this.sling.bodyB.position.x;
    const diff_y = this.sling.pointA.y - this.sling.bodyB.position.y;
    return sqrt(diff_x * diff_x + diff_y * diff_y);
  }
  
  render() {
    if (this.sling.bodyB) {
      stroke(255);
      const pos_a = this.sling.pointA;
      const pos_b = this.sling.bodyB.position;
      line(pos_a.x, pos_a.y, pos_b.x, pos_b.y);
    }
  }
}