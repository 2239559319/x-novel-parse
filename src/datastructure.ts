import { cloneArr } from './polyfill';
import { findMostFrequentNode, isConsecutive } from './utils';

export class ITree {
  constructor(
    public arr: Node[],
    public pickFn?: (node: Node) => boolean,
  ) {}

  public getSiblingNodes() {
    const _tempArr = cloneArr(this.arr);
    let consecutiveArr = [];

    const p1Arr = this._getParent(_tempArr);
    const { indices: p1Indices } = findMostFrequentNode(p1Arr);
    if (this.isChoosed(p1Indices)) {
      return this.getChoosed(p1Indices);
    }
    if (isConsecutive(p1Indices) && p1Indices.length > consecutiveArr.length) {
      consecutiveArr = this.getChoosed(p1Indices);
    }

    const p2Arr = this._getParent(p1Arr);
    const { indices: p2Indices } = findMostFrequentNode(p2Arr);
    if (this.isChoosed(p2Indices)) {
      return this.getChoosed(p2Indices);
    }
    if (isConsecutive(p2Indices) && p2Indices.length > consecutiveArr.length) {
      consecutiveArr = this.getChoosed(p2Indices);
    }

    const p3Arr = this._getParent(p2Arr);
    const { indices: p3Indices } = findMostFrequentNode(p3Arr);
    if (this.isChoosed(p3Indices)) {
      return this.getChoosed(p3Indices);
    }
    if (isConsecutive(p3Indices) && p3Indices.length > consecutiveArr.length) {
      consecutiveArr = this.getChoosed(p3Indices);
    }

    const p4Arr = this._getParent(p3Arr);
    const { indices: p4Indices } = findMostFrequentNode(p4Arr);
    if (this.isChoosed(p4Indices)) {
      return this.getChoosed(p4Indices);
    }
    if (isConsecutive(p4Indices) && p4Indices.length > consecutiveArr.length) {
      consecutiveArr = this.getChoosed(p4Indices);
    }

    return consecutiveArr;
  }

  private _getParent(arr: Node[]) {
    return arr.map((node) => node.parentNode);
  }

  private isChoosed(indices: number[]) {
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
}
