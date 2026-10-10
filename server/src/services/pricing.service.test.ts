import assert from "node:assert/strict";
import test from "node:test";
import { fingerprintCart, parseCartLines } from "./pricing.service.js";

test("parseCartLines combines duplicate IDs before pricing", () => {
    assert.deepEqual(
        parseCartLines([
            { menuID: 7, quantity: 2 },
            { menuID: 3, quantity: 1 },
            { menuID: 7, quantity: 4 },
        ]),
        [
            { menuID: 7, quantity: 6 },
            { menuID: 3, quantity: 1 },
        ],
    );
});

test("fingerprintCart is independent of item order", () => {
    assert.equal(
        fingerprintCart([{ menuID: 7, quantity: 2 }, { menuID: 3, quantity: 1 }]),
        fingerprintCart([{ menuID: 3, quantity: 1 }, { menuID: 7, quantity: 2 }]),
    );
});

test("parseCartLines rejects empty, malformed, and excessive carts", () => {
    assert.throws(() => parseCartLines([]), /between 1 and 50/);
    assert.throws(() => parseCartLines([{ menuID: "7", quantity: 1 }]), /invalid item or quantity/);
    assert.throws(() => parseCartLines([{ menuID: 7, quantity: 0 }]), /invalid item or quantity/);
    assert.throws(
        () => parseCartLines([{ menuID: 7, quantity: 50 }, { menuID: 7, quantity: 50 }]),
        /cannot exceed 99/,
    );
    assert.throws(
        () => parseCartLines(Array.from({ length: 51 }, (_, menuID) => ({ menuID, quantity: 1 }))),
        /between 1 and 50/,
    );
});
