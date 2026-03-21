
// Minimal mock of the calculation logic in Controllers/item.js
function calculateOfferExpiresAt(offerPrice, offerDuration, offerUnit) {
    let offerExpiresAt = null;
    if (parseFloat(offerPrice) > 0 && offerDuration) {
        const duration = parseFloat(offerDuration);
        offerExpiresAt = new Date();
        if (offerUnit === "h") {
            offerExpiresAt.setHours(offerExpiresAt.getHours() + duration);
        } else if (offerUnit === "d") {
            offerExpiresAt.setDate(offerExpiresAt.getDate() + duration);
        }
    }
    return offerExpiresAt;
}

const now = new Date();
console.log("Current time:", now.toISOString());

const test1 = calculateOfferExpiresAt(100, 2, "h");
console.log("Test 1 (100 Rs, 2h):", test1.toISOString());
const diff1 = (test1 - now) / (1000 * 60 * 60);
console.log("Diff 1 (hours):", diff1.toFixed(2));

const test2 = calculateOfferExpiresAt(500, 3, "d");
console.log("Test 2 (500 Rs, 3d):", test2.toISOString());
const diff2 = (test2 - now) / (1000 * 60 * 60 * 24);
console.log("Diff 2 (days):", diff2.toFixed(2));

const test3 = calculateOfferExpiresAt(0, 5, "h");
console.log("Test 3 (0 Rs, 5h):", test3); // Should be null
