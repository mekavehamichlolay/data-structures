class Node {
  isWordEnd: boolean;
  score: number | undefined;
  children: Map<string, Node> | undefined;
  constructor(public value: string) {
    this.isWordEnd = false;
    this.children = undefined;
    this.score = undefined;
  }
}
export default class Trie {
  private root: Node;
  constructor() {
    this.root = new Node("");
  }
  insert(val: string): void {
    if (val === "") return;
    this.addChildren(this.root, val);
  }
  autoComplete(val: string): string[] {
    const wordList: { value: string; score: number }[] = [];
    const firstChildMatch = this.getMatch(val, this.root);
    if (!firstChildMatch) return [];
    this.search(firstChildMatch, val.substring(0, val.length - 1), wordList);
    wordList.sort((a, b) => b.score - a.score);
    return wordList.slice(0, 5).map((w) => w.value);
  }
  delete(val: string): string {
    this.deleteNode(val, this.root);
    return val;
  }
  score(word: string): void {
    this.incrementScore(word, this.root);
  }
  private addChildren(node: Node, val: string): void {
    if (!val || val.length < 1) {
      throw new Error("the value must be set to a string");
    }
    if (!node.children) {
      node.children = new Map<string, Node>();
    }
    const child =
      node.children.get(val.substring(0, 1)) ||
      node.children
        .set(val.substring(0, 1), new Node(val.substring(0, 1)))
        .get(val.substring(0, 1))!;
    if (val.length === 1) {
      child.isWordEnd = true;
    } else {
      this.addChildren(child, val.substring(1));
    }
  }
  private search(
    node: Node,
    word: string,
    wordList: { value: string; score: number }[]
  ) {
    if (!node.children) {
      wordList.push({ value: word + node.value, score: node.score || 0 });
      return;
    }
    if (node.isWordEnd) {
      wordList.push({ value: word + node.value, score: node.score || 0 });
    }
    node.children.forEach((child) => {
      this.search(child, word + node.value, wordList);
    });
  }
  private getMatch(val: string, node: Node): Node | undefined {
    if (val === "") {
      return node;
    }
    if (!node.children) return undefined;
    const childNode = node.children.get(val.substring(0, 1));
    if (!childNode) return undefined;
    if (val.length === 1) return childNode;
    return this.getMatch(val.substring(1), childNode);
  }
  private deleteNode(val: string, father: Node): boolean {
    if (val === "") return false;
    if (!father.children) return false;
    const child = father.children.get(val.substring(0, 1));
    if (!child) return false;
    if (val.length === 1) {
      child.isWordEnd = false;
      if (!child.children) {
        return father.children.delete(val.substring(0, 1));
      }
      return false;
    }
    const grandChildDeleted = this.deleteNode(val.substring(1), child);
    if (
      grandChildDeleted &&
      (!child.children || child.children.size <= 0) &&
      child.isWordEnd === false
    ) {
      return father.children.delete(val.substring(0, 1));
    }
    return false;
  }
  private incrementScore(word: string, node: Node) {
    if (!node.children) return undefined;
    const child = node.children.get(word.substring(0, 1));
    if (!child) return undefined;
    if (word.length === 1 && child.isWordEnd) {
      if (child.score) {
        child.score++;
      } else {
        child.score = 1;
      }
    } else if (word.length > 1) {
      this.incrementScore(word.substring(1), child);
    }
  }
}
