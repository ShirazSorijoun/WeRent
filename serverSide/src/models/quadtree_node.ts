import { Point } from './point';
import { CircularBoundary } from './circular_boundry';

export class QuadTreeNode {
  boundary: CircularBoundary;

  capacity: number;

  points: Point[] = [];

  children: QuadTreeNode[] = [];

  constructor(boundary: CircularBoundary, capacity: number) {
    this.boundary = boundary;
    this.capacity = capacity;
  }

  subdivide(): void {
    const { x, y, radius } = this.boundary;
    const halfR = radius / 2;

    this.children.push(
      new QuadTreeNode(
        new CircularBoundary(x - halfR, y - halfR, halfR),
        this.capacity,
      ),
    ); // NW
    this.children.push(
      new QuadTreeNode(
        new CircularBoundary(x + halfR, y - halfR, halfR),
        this.capacity,
      ),
    ); // NE
    this.children.push(
      new QuadTreeNode(
        new CircularBoundary(x - halfR, y + halfR, halfR),
        this.capacity,
      ),
    ); // SW
    this.children.push(
      new QuadTreeNode(
        new CircularBoundary(x + halfR, y + halfR, halfR),
        this.capacity,
      ),
    ); // SE
  }

  insert(point: Point): boolean {
    if (!this.boundary.contains(point)) {
      return false;
    }

    if (this.points.length < this.capacity) {
      this.points.push(point);
      return true;
    }

    if (this.children.length === 0) {
      this.subdivide();
    }

    for (const child of this.children) {
      if (child.insert(point)) {
        return true;
      }
    }

    return false;
  }
}
