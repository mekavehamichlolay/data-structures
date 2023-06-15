import Trie from "./Trie.ts";

describe("Trie", () => {
  let trie: Trie;

  beforeEach(() => {
    trie = new Trie();
  });

  it("should suggest auto-completions", () => {
    trie.insert("apple");
    trie.insert("application");
    trie.insert("banana");
    trie.insert("cat");
    trie.insert("car");
    trie.insert("bar");
    trie.insert("barli");

    expect(trie.autoComplete("a")).toEqual(["apple", "application"]);
    expect(trie.autoComplete("app")).toEqual(["apple", "application"]);
    expect(trie.autoComplete("ban")).toEqual(["banana"]);
    expect(trie.autoComplete("c")).toEqual(["cat", "car"]);
    expect(trie.autoComplete("z")).toEqual([]);
    expect(trie.autoComplete("bar")).toEqual(["bar", "barli"]);
  });

  it("should handle empty string for auto-completion", () => {
    trie.insert("apple");
    trie.insert("banana");
    trie.insert("car");

    expect(trie.autoComplete("")).toEqual(["apple", "banana", "car"]);
  });

  it("should handle non-existent prefixes", () => {
    trie.insert("apple");
    trie.insert("banana");
    trie.insert("car");

    expect(trie.autoComplete("z")).toEqual([]);
    expect(trie.autoComplete("zzz")).toEqual([]);
  });

  it("should delete items from trie as expected", () => {
    trie.insert("apple");
    trie.insert("application");
    trie.insert("banana");
    trie.insert("cat");
    trie.insert("car");
    trie.insert("bar");
    trie.insert("barli");

    expect(trie.autoComplete("a")).toEqual(["apple", "application"]);
    expect(trie.autoComplete("app")).toEqual(["apple", "application"]);
    expect(trie.autoComplete("ban")).toEqual(["banana"]);
    expect(trie.autoComplete("c")).toEqual(["cat", "car"]);
    expect(trie.autoComplete("z")).toEqual([]);
    expect(trie.autoComplete("bar")).toEqual(["bar", "barli"]);
    trie.delete("ban");
    expect(trie.autoComplete("ban")).toEqual(["banana"]);
    trie.delete("cat");
    trie.delete("apple");
    expect(trie.autoComplete("c")).toEqual(["car"]);
    expect(trie.autoComplete("app")).toEqual(["application"]);
  });
});
