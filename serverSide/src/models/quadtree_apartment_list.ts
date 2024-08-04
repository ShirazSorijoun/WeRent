import { QuadTree } from './quadtree';
import { CircularBoundary } from './circular_boundry';
import { Point } from './point';
import Tama, { ITama } from './tama';

export class QuadTreeSingleton {
  private static instance: QuadTreeSingleton;

  public quadTree: QuadTree;

  private constructor() {
    const quadTreeBoundary = new CircularBoundary(0, 0, 100000); // Example boundary covering a large area
    this.quadTree = new QuadTree(quadTreeBoundary, 4); // Adjust capacity based on your expected data density
  }

  public async initTama() {
    const tamaList: ITama[] = await Tama.find({});

    if (tamaList.length) {
      console.log('Tama data cache loaded');
    }

    for (const tama of tamaList) {
      const { lat, lng } = tama;
      this.quadTree.insert(new Point(lat, lng));
    }
  }

  public static async getInstance(): Promise<QuadTreeSingleton> {
    if (!QuadTreeSingleton.instance) {
      QuadTreeSingleton.instance = new QuadTreeSingleton();
      await QuadTreeSingleton.instance.initTama();
    }
    return QuadTreeSingleton.instance;
  }
}
