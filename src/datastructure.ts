import { cloneArr } from './polyfill';
import { findMostFrequentNode, isConsecutive } from './utils';

export class ITree {
  constructor(
    public arr: Node[],
    public pickFn?: (node: Node) => boolean,
  ) {}

  public getSiblingNodes() {
    const _tempArr = cloneArr(this.arr);
    let longestArr = [];

    const set = new Set<number>();
    let res = [];

    const p1Arr = this._getParent(_tempArr);
    const { indices: p1Indices } = findMostFrequentNode(p1Arr, set);
    if (this.isChoosed(p1Indices) && p1Indices.length > res.length) {
      res = this.getChoosed(p1Indices);
      this.addToSet(p1Indices, set);
    }
    if (p1Indices.length > longestArr.length) {
      longestArr = this.getChoosed(p1Indices);
    }

    const p2Arr = this._getParent(p1Arr);
    const { indices: p2Indices } = findMostFrequentNode(p2Arr, set);
    if (this.isChoosed(p2Indices) && p2Indices.length > res.length) {
      res = this.getChoosed(p2Indices);
      this.addToSet(p2Indices, set);
    }
    if (p2Indices.length > longestArr.length) {
      longestArr = this.getChoosed(p2Indices);
    }

    const p3Arr = this._getParent(p2Arr);
    const { indices: p3Indices } = findMostFrequentNode(p3Arr, set);
    if (this.isChoosed(p3Indices) && p3Indices.length > res.length) {
      res = this.getChoosed(p3Indices);
      this.addToSet(p3Indices, set);
    }
    if (p3Indices.length > longestArr.length) {
      longestArr = this.getChoosed(p3Indices);
    }

    return res.length ? res : longestArr;
  }

  private _getParent(arr: Node[]) {
    return arr.map((node) => node.parentNode ?? node);
  }

  private isChoosed(indices: number[]) {
    if (indices.length === 0) {
      return false;
    }
    const totalCount = indices.length;
    let passCount = 0;

    for (const index of indices) {
      const node = this.arr[index];
      if (this.pickFn?.(node)) {
        passCount += 1;
      }
    }

    if (passCount >= totalCount / 2) {
      return true;
    }
    return false;
  }

  private getChoosed(indices: number[]): Node[] {
    const res = [];

    for (const index of indices) {
      const node = this.arr[index];
      res.push(node);
    }
    return res.reverse();
  }

  private addToSet(arr: number[], set: Set<number>) {
    for (const item of arr) {
      set.add(item);
    }
  }
}
