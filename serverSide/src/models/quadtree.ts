import { QuadTreeNode } from './quadtree_node';
import { CircularBoundary } from './circular_boundry';
import { Point } from './point';

export class QuadTree {
  root: QuadTreeNode;

  constructor(boundary: CircularBoundary, capacity: number) {
    this.root = new QuadTreeNode(boundary, capacity);
  }

  insert(point: Point): void {
    this.root.insert(point);
  }

  query(range: CircularBoundary, found: Point[] = []): Point[] {
    this._queryRecursive(this.root, range, found);
    return found;
  }

  private _queryRecursive(
    node: QuadTreeNode,
    range: CircularBoundary,
    found: Point[],
  ): void {
    if (!node.boundary.intersects(range)) {
      return;
    }

    for (const point of node.points) {
      if (range.contains(point)) {
        found.push(point);
      }
    }

    if (node.children.length > 0) {
      for (const child of node.children) {
        this._queryRecursive(child, range, found);
      }
    }
  }
}
