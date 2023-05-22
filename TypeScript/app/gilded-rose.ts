const NORMAL_DECREASE_QUALITY = 1;
const DOUBLE_DECREASE_QUALITY = 2;
const TRIPLE_DECREASE_QUALITY = 3;

const MAX_QUALITY = 50;

interface ItemInterface {
  name: string;
  sellIn: number;
  quality: number;
}

class Item {
  name: string;
  sellIn: number;
  quality: number;

  constructor(name: string, sellIn: number, quality: number) {
    // console.log("#### vlod jest-coverage-strange Item.cstr");
    this.name = name;
    this.sellIn = sellIn;
    this.quality = quality;
  }
}

// TODO: move all these classes to separate files.
class GenericItem extends Item {
  constructor(params: ItemInterface) {
    // console.log("#### vlod jest-coverage-strange GenericItem.cstr");
    super(params.name, params.sellIn, Math.min(MAX_QUALITY, params.quality));
  }

  updateQuality() {
    if (this.quality === 0) {
      // console.log("#### vlod jest-coverage-strange GenericItem.updateQuality");
      return this;
    }

    const depreciation =
      this.sellIn > 0 ? NORMAL_DECREASE_QUALITY : DOUBLE_DECREASE_QUALITY;

    this.quality -= depreciation;

    return this;
  }
}

class AgedBrieItem extends Item {
  constructor(params: ItemInterface) {
    super(params.name, params.sellIn, Math.min(MAX_QUALITY, params.quality));
  }

  updateQuality() {
    if (this.quality < MAX_QUALITY) {
      this.quality++;

      // TODO: I think this is a bug in original code, see test named "should never increase quality of items >50"
      // for now, just replicate the bug
      if (this.sellIn < 0) this.quality += NORMAL_DECREASE_QUALITY;
    }

    return this;
  }
}

class SulfurasItem extends Item {
  constructor(params: ItemInterface) {
    // spec: "Sulfuras" is legendary item and as such its Quality is 80 and it never alters.
    const UNCHANGABLE_QUALITY = 80;

    super(params.name, params.sellIn, UNCHANGABLE_QUALITY);
  }

  updateQuality() {
    // spec: never alters
    return this;
  }
}

class BackstagePassItem extends Item {
  constructor(params: ItemInterface) {
    super(params.name, params.sellIn, Math.min(MAX_QUALITY, params.quality));
  }

  updateQuality() {
    if (this.sellIn == 0) {
      this.quality = 0;
    } else if (this.sellIn < 6) {
      this.quality += TRIPLE_DECREASE_QUALITY;
    } else if (this.sellIn < 11) {
      this.quality += DOUBLE_DECREASE_QUALITY;
    } else {
      this.quality += NORMAL_DECREASE_QUALITY;
    }
    return this;
  }
}

class ConjuredItem extends Item {
  constructor(params) {
    super(params.name, params.sellIn, Math.min(MAX_QUALITY, params.quality));
  }

  updateQuality() {
    if (this.quality === 0) return this;

    //  "Conjured" items degrade in Quality twice as fast as normal items
    this.quality -= DOUBLE_DECREASE_QUALITY;

    return this;
  }
}

type DerivedItemType =
  | typeof AgedBrieItem
  | typeof SulfurasItem
  | typeof BackstagePassItem
  | typeof ConjuredItem
  | typeof GenericItem;

class Shop {
  items: Array<
    AgedBrieItem | SulfurasItem | BackstagePassItem | ConjuredItem | GenericItem
  >;

  constructor(items: ItemInterface[] = []) {
    const derivedItemLookup: Record<string, DerivedItemType> = {
      "Aged Brie": AgedBrieItem,
      "Sulfuras, Hand of Ragnaros": SulfurasItem,
      "Backstage passes to a TAFKAL80ETC concert": BackstagePassItem,
      "Conjured Item": ConjuredItem,
    };

    this.items = items.map((item) => {
      const derivedItem = derivedItemLookup[item.name] || GenericItem;

      return new derivedItem({
        name: item.name,
        sellIn: item.sellIn,
        quality: item.quality,
      });
    });
  }

  updateQuality() {
    this.items = this.items.map((item) => item.updateQuality());
    return this.items;
  }
}

export { Item, GenericItem, Shop };
