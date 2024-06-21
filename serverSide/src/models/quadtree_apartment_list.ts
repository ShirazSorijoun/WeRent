import { QuadTree } from './quadtree';
import { CircularBoundary } from './circular_boundry';
import { Point } from './point';

export class QuadTreeSingleton {
  private static instance: QuadTreeSingleton;

  public quadTree: QuadTree;

  private constructor() {
    const quadTreeBoundary = new CircularBoundary(0, 0, 100000); // Example boundary covering a large area
    this.quadTree = new QuadTree(quadTreeBoundary, 4); // Adjust capacity based on your expected data density

    // Initialize with example points (replace with your actual data)
    this.quadTree.insert(new Point(40.7128, -74.006)); // Example: New York City
    this.quadTree.insert(new Point(34.0522, -118.2437)); // Example: Los Angeles
    this.quadTree.insert(new Point(51.5074, -0.1278)); // Example: London
    this.quadTree.insert(new Point(35.6895, 139.6917)); // Example: Tokyo
  }

  public static getInstance(): QuadTreeSingleton {
    if (!QuadTreeSingleton.instance) {
      QuadTreeSingleton.instance = new QuadTreeSingleton();
    }
    return QuadTreeSingleton.instance;
  }
}
