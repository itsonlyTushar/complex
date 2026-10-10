import assert from "node:assert/strict";
import test from "node:test";
import { canAccessRole } from "./auth.middleware.js";

const vendor = {
    id: 1,
    role: "RESTAURANT_VENDOR" as const,
    email: "vendor@example.test",
    foodCourtId: "court-1",
    restaurantId: "restaurant-1",
};

test("role authorization denies missing identities and disallowed roles", () => {
    assert.equal(canAccessRole(undefined, ["SUPER_ADMIN"]), false);
    assert.equal(canAccessRole(vendor, ["SUPER_ADMIN"]), false);
});

test("role authorization permits explicitly allowed roles", () => {
    assert.equal(canAccessRole(vendor, ["RESTAURANT_VENDOR"]), true);
});
