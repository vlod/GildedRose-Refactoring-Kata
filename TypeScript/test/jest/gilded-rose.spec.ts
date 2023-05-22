import { Item, GenericItem, Shop } from "@/gilded-rose";

describe("Gilded Rose", () => {
  it("should create Item properly", () => {
    const item = new Item("foo", 10, 8);

    expect(item).not.toBeNull();

    expect(item.name).toBe("foo");
    expect(item.sellIn).toBe(10);
    expect(item.quality).toBe(8);
  });

  it("should degrade quality before sellBy", () => {
    const gildedRose = new Shop([new Item("foo", 10, 8)]);
    const items = gildedRose.updateQuality();

    expect(items.length).toBe(1);

    expect(items[0].name).toBe("foo");
    expect(items[0].quality).toBe(7);
  });

  //  Once the sell by date has passed, Quality degrades twice as fast
  it("should degrade quality twice as fast if pass sellBy", () => {
    const gildedRose = new Shop([
      new Item("foo1", 0, 8),
      new Item("foo2", 0, 2),
      new Item("foo3", 0, 0),
    ]);
    const items = gildedRose.updateQuality();

    expect(items.length).toBe(3);

    expect(items[0].name).toBe("foo1");
    expect(items[0].quality).toBe(6);

    expect(items[1].name).toBe("foo2");
    expect(items[1].quality).toBe(0);

    expect(items[2].name).toBe("foo3");
    expect(items[2].quality).toBe(0);
  });

  // The Quality of an item is never negative
  it("should never decrease quality <0", () => {
    const gildedRose = new Shop([new Item("foo", 2, 0)]);
    const items = gildedRose.updateQuality();

    expect(items[0].quality).toBe(0);
  });

  describe("Brie", () => {
    // "Aged Brie" actually increases in Quality the older it gets
    it("should increase quality if Brie", () => {
      const gildedRose = new Shop([new Item("Aged Brie", 2, 30)]);
      const items = gildedRose.updateQuality();

      expect(items.length).toBe(1);

      expect(items[0].quality).toBe(31);
    });

    // The Quality of an item is never more than 50
    it("should never increase quality of items >50", () => {
      const gildedRose = new Shop([
        new Item("Aged Brie", 2, 50),
        new Item("Aged Brie", 2, 60),
        new Item("Aged Brie", -2, 30),
      ]);
      const items = gildedRose.updateQuality();

      expect(items.length).toBe(3);

      expect(items[0].quality).toBe(50);
      expect(items[1].quality).toBe(50);
      // TODO: I think this is a bug in original code, should be 31
      expect(items[2].quality).toBe(32);
    });
  });

  describe("Sulfuras", () => {
    // "Sulfuras", being a legendary item, never has to be sold or decreases in Quality
    it("should never change sellIn or quality for Sulfuras", () => {
      const gildedRose = new Shop([
        new Item("Sulfuras, Hand of Ragnaros", 0, 80),
        new Item("Sulfuras, Hand of Ragnaros", -1, 80),
      ]);
      const items = gildedRose.updateQuality();

      expect(items.length).toBe(2);

      expect(items[0].sellIn).toBe(0);
      expect(items[0].quality).toBe(80);

      expect(items[1].sellIn).toBe(-1);
      expect(items[1].quality).toBe(80);
    });

    it("should always have a quality of 80 for Sulfuras", () => {
      const gildedRose = new Shop([
        new Item("Sulfuras, Hand of Ragnaros", 10, 8),
      ]);
      const items = gildedRose.updateQuality();

      expect(items.length).toBe(1);

      expect(items[0].quality).toBe(80);
    });
  });

  describe("Backstage", () => {
    // "Backstage passes", like aged brie, increases in Quality as its SellIn value approaches
    it("should increase quality normally > 10 days left", () => {
      const gildedRose = new Shop([
        new Item("Backstage passes to a TAFKAL80ETC concert", 11, 20),
        new Item("Backstage passes to a TAFKAL80ETC concert", 20, 10),
      ]);
      const items = gildedRose.updateQuality();

      expect(items.length).toBe(2);

      expect(items[0].quality).toBe(21);
      expect(items[1].quality).toBe(11);
    });

    // Quality increases by x2 when there are 10 days or less
    it("should increase quality by double < 10 days left", () => {
      const gildedRose = new Shop([
        new Item("Backstage passes to a TAFKAL80ETC concert", 10, 10),
        new Item("Backstage passes to a TAFKAL80ETC concert", 8, 20),
      ]);
      const items = gildedRose.updateQuality();

      expect(items.length).toBe(2);

      expect(items[0].quality).toBe(12);
      expect(items[1].quality).toBe(22);
    });

    // Quality increases by x3 when there are 5 days or less
    it("should increase quality by triple < 5 days left", () => {
      const gildedRose = new Shop([
        new Item("Backstage passes to a TAFKAL80ETC concert", 5, 20),
        new Item("Backstage passes to a TAFKAL80ETC concert", 2, 30),
      ]);
      const items = gildedRose.updateQuality();

      expect(items.length).toBe(2);

      expect(items[0].quality).toBe(23);
      expect(items[1].quality).toBe(33);
    });

    // Quality drops to 0 after the concert
    it("should drop quality to 0 with 0 days days left", () => {
      const gildedRose = new Shop([
        new Item("Backstage passes to a TAFKAL80ETC concert", 0, 30),
      ]);
      const items = gildedRose.updateQuality();

      expect(items.length).toBe(1);

      expect(items[0].quality).toBe(0);
    });
  });

  describe("Shop", () => {
    it("should handle no items supplied to Shop", () => {
      const gildedRose = new Shop();
      const items = gildedRose.updateQuality();

      expect(items.length).toBe(0);
    });
  });

  describe("Conjured", () => {
    // "Conjured" items degrade in Quality twice as fast as normal items
    it("should decrease quality double for Conjured Item", () => {
      const gildedRose = new Shop([
        new Item("Conjured Item", 0, 20),
        new Item("Conjured Item", 0, 0),
      ]);
      const items = gildedRose.updateQuality();

      expect(items.length).toBe(2);

      expect(items[0].quality).toBe(18);
      expect(items[1].quality).toBe(0);
    });
  });
});
