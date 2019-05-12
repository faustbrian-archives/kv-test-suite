import { IKeyValueStoreAsync } from "@keeveestore/keeveestore";
import "jest-extended";

// @ts-ignore
export const complianceTestsAsync = <K, T>(store: IKeyValueStoreAsync<K, T>, items: Record<K, T>): void => {
	// @ts-ignore
	const itemsEntries: Array<[K, T]> = Object.entries(items);
	// @ts-ignore
	const itemsKeys: K[] = Object.keys(items);
	const itemsValues: T[] = Object.values(items);

	const resultsTrue: boolean[] = new Array(itemsEntries.length).fill(true);
	const resultsFalse: boolean[] = new Array(itemsEntries.length).fill(false);
	const resultsUndefined: boolean[] = new Array(itemsEntries.length).fill(undefined);

	beforeEach(() => store.flush());

	describe(".all()", () => {
		it("should return a promise", async () => {
			await expect(store.all()).toBeInstanceOf(Promise);
		});

		it("should get all of the items in the store.", async () => {
			await expect(store.all()).resolves.toBeEmpty();

			await store.putMany(itemsEntries);

			await expect(store.all()).resolves.toEqual(expect.arrayContaining(itemsEntries));
		});
	});

	describe(".keys()", () => {
		it("should returns a promise", async () => {
			await expect(store.keys()).toBeInstanceOf(Promise);
		});

		it("should get the values of the store items.", async () => {
			await expect(store.keys()).resolves.toBeEmpty();

			await store.putMany(itemsEntries);

			await expect(store.keys()).resolves.toEqual(expect.arrayContaining(itemsKeys));
		});
	});

	describe(".values()", () => {
		it("should returns a promise", async () => {
			await expect(store.values()).toBeInstanceOf(Promise);
		});

		it("should get the values of the store items.", async () => {
			await expect(store.values()).resolves.toBeEmpty();

			await store.putMany(itemsEntries);

			await expect(store.values()).resolves.toEqual(expect.arrayContaining(itemsValues));
		});
	});

	describe(".get(key)", () => {
		it("should returns a promise", async () => {
			await expect(store.get(itemsKeys[0])).toBeInstanceOf(Promise);
		});

		it("should get an item from the store", async () => {
			await store.put(itemsKeys[0], itemsValues[0]);

			await expect(store.get(itemsKeys[0])).resolves.toBe(itemsValues[0]);
		});

		it("should fail get an item from the store", async () => {
			await expect(store.get(itemsKeys[0])).resolves.toBeUndefined();
		});
	});

	describe(".getMany(keys)", () => {
		it("should returns a promise", async () => {
			await expect(store.getMany(itemsKeys)).toBeInstanceOf(Promise);
		});

		it("should get many items from the store", async () => {
			await expect(store.getMany(itemsKeys)).resolves.toEqual(resultsUndefined);

			await store.putMany(itemsEntries);

			await expect(store.getMany(itemsKeys)).resolves.toEqual(itemsValues);
		});
	});

	describe(".pull(key)", () => {
		it("should returns a promise", async () => {
			await expect(store.pull(itemsKeys[0])).toBeInstanceOf(Promise);
		});

		it("should pull an item from the store", async () => {
			await store.put(itemsKeys[0], itemsValues[0]);

			await expect(store.isNotEmpty()).resolves.toBeTrue();
			await expect(store.pull(itemsKeys[0])).resolves.toBe(itemsValues[0]);
			await expect(store.isEmpty()).resolves.toBeTrue();
		});

		it("should fail pull an item from the store", async () => {
			await expect(store.pull(itemsKeys[0])).resolves.toBeUndefined();
		});
	});

	describe(".pullMany(keys)", () => {
		it("should returns a promise", async () => {
			await expect(store.pullMany([itemsKeys[0]])).toBeInstanceOf(Promise);
		});

		it("should pull many items from the store", async () => {
			await store.put(itemsKeys[0], itemsValues[0]);
			await store.put(itemsKeys[1], itemsValues[1]);

			await expect(store.isNotEmpty()).resolves.toBeTrue();
			await expect(store.pullMany([itemsKeys[0], itemsKeys[1]])).resolves.toEqual([
				itemsValues[0],
				itemsValues[1],
			]);
			await expect(store.isEmpty()).resolves.toBeTrue();
		});

		it("should fail to pull many items from the store", async () => {
			await expect(store.pullMany([itemsKeys[0]])).resolves.toEqual([undefined]);
		});
	});

	describe(".put(key, value)", () => {
		it("should returns a promise", async () => {
			await expect(store.put(itemsKeys[0], itemsValues[0])).toBeInstanceOf(Promise);
		});

		it("should put an item into the store", async () => {
			await expect(store.put(itemsKeys[0], itemsValues[0])).resolves.toBeTrue();
		});

		it("should overwrite an item in the store", async () => {
			await expect(store.put(itemsKeys[0], itemsValues[0])).resolves.toBeTrue();

			await expect(store.get(itemsKeys[0])).resolves.toBe(itemsValues[0]);

			await expect(store.count()).resolves.toBe(1);

			await expect(store.put(itemsKeys[0], itemsValues[1])).resolves.toBeTrue();

			await expect(store.get(itemsKeys[0])).resolves.toBe(itemsValues[1]);

			await expect(store.count()).resolves.toBe(1);
		});
	});

	describe(".putMany(values)", () => {
		it("should returns a promise", async () => {
			await expect(store.putMany(itemsEntries)).toBeInstanceOf(Promise);
		});

		it("should put many items into the store", async () => {
			await expect(store.putMany([itemsEntries[0], itemsEntries[1]])).resolves.toEqual([true, true]);
			await expect(store.isNotEmpty()).resolves.toBeTrue();
		});
	});

	describe(".has(key)", () => {
		it("should returns a promise", async () => {
			await expect(store.has(itemsKeys[0])).toBeInstanceOf(Promise);
		});

		it("should have an item", async () => {
			await store.put(itemsKeys[0], itemsValues[0]);

			await expect(store.has(itemsKeys[0])).resolves.toBeTrue();
		});

		it("should not have an item", async () => {
			await expect(store.has(itemsKeys[0])).resolves.toBeFalse();
		});
	});

	describe(".hasMany(keys)", () => {
		it("should returns a promise", async () => {
			await expect(store.hasMany(itemsKeys)).toBeInstanceOf(Promise);
		});

		it("should have all items", async () => {
			await store.putMany(itemsEntries);

			await expect(store.hasMany(itemsKeys)).resolves.toEqual(resultsTrue);
		});

		it("should have some items", async () => {
			await store.put(itemsKeys[0], itemsValues[0]);

			await expect(store.hasMany([itemsKeys[0], itemsKeys[1]])).resolves.toEqual([true, false]);
		});

		it("should not have any items", async () => {
			await expect(store.hasMany([itemsKeys[0], itemsKeys[1]])).resolves.toEqual([false, false]);
		});
	});

	describe(".missing(key)", () => {
		it("should returns a promise", async () => {
			await expect(store.missing(itemsKeys[0])).toBeInstanceOf(Promise);
		});

		it("should be missing an item", async () => {
			await expect(store.missing(itemsKeys[0])).resolves.toBeTrue();
		});

		it("should not be missing an item", async () => {
			await store.put(itemsKeys[0], itemsValues[0]);

			await expect(store.missing(itemsKeys[0])).resolves.toBeFalse();
		});
	});

	describe(".missingMany(keys)", () => {
		it("should returns a promise", async () => {
			await expect(store.missingMany(itemsKeys)).toBeInstanceOf(Promise);
		});

		it("should be missing all items", async () => {
			await expect(store.missingMany(itemsKeys)).resolves.toEqual(resultsTrue);
		});

		it("should be missing some items", async () => {
			await store.put(itemsKeys[0], itemsValues[0]);

			await expect(store.missingMany(itemsKeys)).resolves.toEqual([false, true, true, true, true]);
		});

		it("should not be missing any items", async () => {
			await store.putMany(itemsEntries);

			await expect(store.missingMany(itemsKeys)).resolves.toEqual(resultsFalse);
		});
	});

	describe(".forget(key)", () => {
		it("should returns a promise", async () => {
			await expect(store.forget(itemsKeys[0])).toBeInstanceOf(Promise);
		});

		it("should remove an item from the store", async () => {
			await expect(store.forget(itemsKeys[0])).resolves.toBeFalse();
			await expect(store.isEmpty()).resolves.toBeTrue();

			await store.put(itemsKeys[0], itemsValues[0]);

			await expect(store.forget(itemsKeys[0])).resolves.toBeTrue();
			await expect(store.isEmpty()).resolves.toBeTrue();
		});
	});

	describe(".forgetMany(keys)", () => {
		it("should returns a promise", async () => {
			await expect(store.forgetMany(itemsKeys)).toBeInstanceOf(Promise);
		});

		it("should remove many items from the store", async () => {
			await expect(store.forgetMany(itemsKeys)).resolves.toEqual(resultsFalse);
			await expect(store.isEmpty()).resolves.toBeTrue();

			await store.putMany(itemsEntries);

			await expect(store.forgetMany(itemsKeys)).resolves.toEqual(resultsTrue);
			await expect(store.isEmpty()).resolves.toBeTrue();
		});
	});

	describe(".flush()", () => {
		it("should returns a promise", async () => {
			await expect(store.flush()).toBeInstanceOf(Promise);
		});

		it("should remove all items from the store", async () => {
			await expect(store.flush()).resolves.toBeBoolean();
		});
	});

	describe(".count()", () => {
		it("should returns a promise", async () => {
			await expect(store.count()).toBeInstanceOf(Promise);
		});

		it("should count all records", async () => {
			await expect(store.count()).resolves.toBe(0);

			await store.put(itemsKeys[0], itemsValues[0]);

			await expect(store.count()).resolves.toBe(1);
		});
	});

	describe(".isEmpty()", () => {
		it("should returns a promise", async () => {
			await expect(store.isEmpty()).toBeInstanceOf(Promise);
		});

		it("should count as empty if there are 0 items", async () => {
			await expect(store.isEmpty()).resolves.toBeTrue();

			await store.put(itemsKeys[0], itemsValues[0]);

			await expect(store.isEmpty()).resolves.toBeFalse();
		});
	});

	describe(".isNotEmpty()", () => {
		it("should returns a promise", async () => {
			await expect(store.isNotEmpty()).toBeInstanceOf(Promise);
		});

		it("should count as not empty if there are 1 or more items", async () => {
			await expect(store.isNotEmpty()).resolves.toBeFalse();

			await store.put(itemsKeys[0], itemsValues[0]);

			await expect(store.isNotEmpty()).resolves.toBeTrue();
		});
	});
};
