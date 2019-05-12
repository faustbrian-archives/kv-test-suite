import { IKeyValueStoreSync } from "@keeveestore/keeveestore";
import "jest-extended";

// @ts-ignore
export const complianceTestsSync = <K, T>(createStore: () => IKeyValueStoreSync<K, T>, items: Record<K, T>): void => {
	// @ts-ignore
	const itemsEntries: Array<[K, T]> = Object.entries(items);
	// @ts-ignore
	const itemsKeys: K[] = Object.keys(items);
	const itemsValues: T[] = Object.values(items);

	const resultsTrue: boolean[] = new Array(itemsEntries.length).fill(true);
	const resultsFalse: boolean[] = new Array(itemsEntries.length).fill(false);
	const resultsUndefined: boolean[] = new Array(itemsEntries.length).fill(undefined);

	// Arrange
	let store: IKeyValueStoreSync<K, T>;
	beforeAll(() => (store = createStore()));
	beforeEach(() => store.flush());

	describe(".all()", () => {
		it("should get all of the items in the store.", () => {
			expect(store.all()).toBeEmpty();

			store.putMany(itemsEntries);

			expect(store.all()).toEqual(itemsEntries);
		});
	});

	describe(".keys()", () => {
		it("should get the values of the store items.", () => {
			expect(store.keys()).toBeEmpty();

			store.putMany(itemsEntries);

			expect(store.keys()).toEqual(itemsKeys);
		});
	});

	describe(".values()", () => {
		it("should get the values of the store items.", () => {
			expect(store.values()).toBeEmpty();

			store.putMany(itemsEntries);

			expect(store.values()).toEqual(itemsValues);
		});
	});

	describe(".get(key)", () => {
		it("should get an item from the store", () => {
			store.put(itemsKeys[0], itemsValues[0]);

			expect(store.get(itemsKeys[0])).toBe(itemsValues[0]);
		});

		it("should fail get an item from the store", () => {
			expect(store.get(itemsKeys[0])).toBeUndefined();
		});
	});

	describe(".getMany(keys)", () => {
		it("should get many items from the store", () => {
			expect(store.getMany(itemsKeys)).toEqual(resultsUndefined);

			store.putMany(itemsEntries);

			expect(store.getMany(itemsKeys)).toEqual(itemsValues);
		});
	});

	describe(".pull(key)", () => {
		it("should pull an item from the store", () => {
			store.put(itemsKeys[0], itemsValues[0]);

			expect(store.isNotEmpty()).toBeTrue();
			expect(store.pull(itemsKeys[0])).toBe(itemsValues[0]);
			expect(store.isEmpty()).toBeTrue();
		});

		it("should fail pull an item from the store", () => {
			expect(store.pull(itemsKeys[0])).toBeUndefined();
		});
	});

	describe(".pullMany(keys)", () => {
		it("should pull many items from the store", () => {
			store.put(itemsKeys[0], itemsValues[0]);
			store.put(itemsKeys[1], itemsValues[1]);

			expect(store.isNotEmpty()).toBeTrue();
			expect(store.pullMany([itemsKeys[0], itemsKeys[1]])).toEqual([itemsValues[0], itemsValues[1]]);
			expect(store.isEmpty()).toBeTrue();
		});

		it("should fail to pull many items from the store", () => {
			expect(store.pullMany([itemsKeys[0]])).toEqual([undefined]);
		});
	});

	describe(".put(key, value)", () => {
		it("should put an item into the store", () => {
			expect(store.put(itemsKeys[0], itemsValues[0])).toBeTrue();
		});

		it("should overwrite an item in the store", () => {
			expect(store.put(itemsKeys[0], itemsValues[0])).toBeTrue();

			expect(store.get(itemsKeys[0])).toBe(itemsValues[0]);

			expect(store.count()).toBe(1);

			expect(store.put(itemsKeys[0], itemsValues[1])).toBeTrue();

			expect(store.get(itemsKeys[0])).toBe(itemsValues[1]);

			expect(store.count()).toBe(1);
		});
	});

	describe(".putMany(values)", () => {
		it("should put many items into the store", () => {
			expect(store.putMany([itemsEntries[0], itemsEntries[1]])).toEqual([true, true]);
			expect(store.isNotEmpty()).toBeTrue();
		});
	});

	describe(".has(key)", () => {
		it("should have an item", () => {
			store.put(itemsKeys[0], itemsValues[0]);

			expect(store.has(itemsKeys[0])).toBeTrue();
		});

		it("should not have an item", () => {
			expect(store.has(itemsKeys[0])).toBeFalse();
		});
	});

	describe(".hasMany(keys)", () => {
		it("should have all items", () => {
			store.putMany(itemsEntries);

			expect(store.hasMany(itemsKeys)).toEqual(resultsTrue);
		});

		it("should have some items", () => {
			store.put(itemsKeys[0], itemsValues[0]);

			expect(store.hasMany([itemsKeys[0], itemsKeys[1]])).toEqual([true, false]);
		});

		it("should not have any items", () => {
			expect(store.hasMany([itemsKeys[0], itemsKeys[1]])).toEqual([false, false]);
		});
	});

	describe(".missing(key)", () => {
		it("should be missing an item", () => {
			expect(store.missing(itemsKeys[0])).toBeTrue();
		});

		it("should not be missing an item", () => {
			store.put(itemsKeys[0], itemsValues[0]);

			expect(store.missing(itemsKeys[0])).toBeFalse();
		});
	});

	describe(".missingMany(keys)", () => {
		it("should be missing all items", () => {
			expect(store.missingMany(itemsKeys)).toEqual(resultsTrue);
		});

		it("should be missing some items", () => {
			store.put(itemsKeys[0], itemsValues[0]);

			expect(store.missingMany(itemsKeys)).toEqual([false, true, true, true, true]);
		});

		it("should not be missing any items", () => {
			store.putMany(itemsEntries);

			expect(store.missingMany(itemsKeys)).toEqual(resultsFalse);
		});
	});

	describe(".forget(key)", () => {
		it("should remove an item from the store", () => {
			expect(store.forget(itemsKeys[0])).toBeFalse();
			expect(store.isEmpty()).toBeTrue();

			store.put(itemsKeys[0], itemsValues[0]);

			expect(store.forget(itemsKeys[0])).toBeTrue();
			expect(store.isEmpty()).toBeTrue();
		});
	});

	describe(".forgetMany(keys)", () => {
		it("should remove many items from the store", () => {
			expect(store.forgetMany(itemsKeys)).toEqual(resultsFalse);
			expect(store.isEmpty()).toBeTrue();

			store.putMany(itemsEntries);

			expect(store.forgetMany(itemsKeys)).toEqual(resultsTrue);
			expect(store.isEmpty()).toBeTrue();
		});
	});

	describe(".flush()", () => {
		it("should remove all items from the store", () => {
			expect(store.flush()).toBeBoolean();
		});
	});

	describe(".count()", () => {
		it("should count all records", () => {
			expect(store.count()).toBe(0);

			store.put(itemsKeys[0], itemsValues[0]);

			expect(store.count()).toBe(1);
		});
	});

	describe(".isEmpty()", () => {
		it("should count as empty if there are 0 items", () => {
			expect(store.isEmpty()).toBeTrue();

			store.put(itemsKeys[0], itemsValues[0]);

			expect(store.isEmpty()).toBeFalse();
		});
	});

	describe(".isNotEmpty()", () => {
		it("should count as not empty if there are 1 or more items", () => {
			expect(store.isNotEmpty()).toBeFalse();

			store.put(itemsKeys[0], itemsValues[0]);

			expect(store.isNotEmpty()).toBeTrue();
		});
	});
};
