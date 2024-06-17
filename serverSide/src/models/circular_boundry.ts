import { Point } from './point';

export class CircularBoundary {
  x: number; // longitude

  y: number; // latitude

  radius: number; // radius in meters

  constructor(x: number, y: number, radius: number) {
    this.x = x;
    this.y = y;
    this.radius = radius;
  }

  contains(point: Point): boolean {
    const dx = point.x - this.x;
    const dy = point.y - this.y;
    return dx * dx + dy * dy <= this.radius * this.radius;
  }

  intersects(range: CircularBoundary): boolean {
    const dx = range.x - this.x;
    const dy = range.y - this.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    return distance <= this.radius + range.radius;
  }
}
