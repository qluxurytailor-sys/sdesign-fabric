/*
 * S-DESIGN — extract-sizes.jsx
 * --------------------------------------------------------------
 * Run inside Adobe Illustrator: File > Scripts > Other Script…
 * (or place in Illustrator/Presets/.../Scripts and restart)
 *
 * What it does:
 *   Scans the active .ai document and produces a Size Calibration
 *   Mapping JSON that the separate web calibration tool consumes.
 *
 * Expected organization (either pattern works):
 *   A) Top-level LAYERS named after the size: "S","M","L","XL","2XL","3XL","4XL"
 *      Inside each, pageItems named: "front","back","sleeveL","sleeveR","collar","stripe"
 *   B) Top-level pageItems named "<size>_<piece>" e.g. "M_front", "XL_sleeveL"
 *
 * Output:
 *   A JSON file you choose the save location for. Compatible with
 *   calibration.html in the same folder.
 * --------------------------------------------------------------
 */

#target illustrator

(function () {
    if (app.documents.length === 0) {
        alert("Open an .ai document first.");
        return;
    }

    var SIZES  = ["S", "M", "L", "XL", "2XL", "3XL", "4XL"];
    var PIECES = ["front", "back", "sleeveL", "sleeveR", "collar", "stripe"];
    var PT_TO_MM = 25.4 / 72.0;

    var doc = app.activeDocument;
    var profile = {
        "$schema":       "size-mapping-profile-v1",
        profileName:     doc.name.replace(/\.[aA][iI]$/, ""),
        version:         "1.0",
        createdAt:       isoNow(),
        unit:            "mm",
        baseSize:        "M",
        nameMaxLength:   280,
        pieces:          PIECES,
        sizes:           {}
    };

    // Index every page item by name across all layers
    var named = {};
    indexItems(doc, named);

    // Strategy A: per-size layer
    for (var i = 0; i < SIZES.length; i++) {
        var size = SIZES[i];
        var layer = findLayer(doc.layers, size);
        if (!layer) continue;
        profile.sizes[size] = collectFromLayer(layer);
    }

    // Strategy B: prefix-based fallback for any size not yet captured
    for (var j = 0; j < SIZES.length; j++) {
        var s2 = SIZES[j];
        if (profile.sizes[s2]) continue;
        var bag = collectFromPrefix(named, s2);
        if (bag) profile.sizes[s2] = bag;
    }

    var sizeCount = 0;
    for (var k in profile.sizes) if (profile.sizes.hasOwnProperty(k)) sizeCount++;
    if (sizeCount === 0) {
        alert("No matching layers or named items found.\n" +
              "Expected layers named " + SIZES.join(", ") +
              "\nor items named like 'M_front'.");
        return;
    }

    var defaultName = profile.profileName + ".profile.json";
    var outFile = File.saveDialog("Save calibration profile as…", defaultName);
    if (!outFile) return;

    outFile.encoding = "UTF-8";
    outFile.open("w");
    outFile.write(toJSON(profile));
    outFile.close();

    alert("Saved profile with " + sizeCount + " size(s):\n" + outFile.fsName);

    // ---------- helpers ----------

    function findLayer(layers, name) {
        for (var i = 0; i < layers.length; i++) {
            if (layers[i].name === name) return layers[i];
        }
        return null;
    }

    function collectFromLayer(layer) {
        var bag = { artboard: null };
        walkLayer(layer, function (item) {
            if (!item.name) return;
            for (var p = 0; p < PIECES.length; p++) {
                if (item.name === PIECES[p]) {
                    bag[PIECES[p]] = boundsOf(item);
                    return;
                }
            }
        });
        bag.artboard = inferArtboardForLayerName(layer.name) || bagBoundingBox(bag);
        return bag;
    }

    function collectFromPrefix(named, size) {
        var bag = { artboard: null };
        var hit = false;
        for (var p = 0; p < PIECES.length; p++) {
            var key = size + "_" + PIECES[p];
            if (named[key]) {
                bag[PIECES[p]] = boundsOf(named[key]);
                hit = true;
            }
        }
        if (!hit) return null;
        bag.artboard = inferArtboardForLayerName(size) || bagBoundingBox(bag);
        return bag;
    }

    function inferArtboardForLayerName(name) {
        var abs = doc.artboards;
        for (var i = 0; i < abs.length; i++) {
            if (abs[i].name === name) {
                var r = abs[i].artboardRect; // [L,T,R,B] in pt
                return {
                    w: round1((r[2] - r[0]) * PT_TO_MM),
                    h: round1((r[1] - r[3]) * PT_TO_MM)
                };
            }
        }
        return null;
    }

    function bagBoundingBox(bag) {
        var maxX = 0, maxY = 0, found = false;
        for (var p = 0; p < PIECES.length; p++) {
            var b = bag[PIECES[p]];
            if (!b) continue;
            found = true;
            if (b.x + b.w > maxX) maxX = b.x + b.w;
            if (b.y + b.h > maxY) maxY = b.y + b.h;
        }
        return found ? { w: round1(maxX), h: round1(maxY) } : null;
    }

    function indexItems(container, into) {
        for (var i = 0; i < container.pageItems.length; i++) {
            var it = container.pageItems[i];
            if (it.name) into[it.name] = it;
        }
    }

    function walkLayer(layer, visit) {
        for (var i = 0; i < layer.pageItems.length; i++) visit(layer.pageItems[i]);
        for (var j = 0; j < layer.layers.length; j++) walkLayer(layer.layers[j], visit);
    }

    function boundsOf(item) {
        // geometricBounds: [left, top, right, bottom] in pt; in Illustrator's
        // default coordinate system top-y is the LARGER value, bottom-y smaller.
        var g = item.geometricBounds;
        var left   = g[0];
        var top    = g[1];
        var right  = g[2];
        var bottom = g[3];
        var w = Math.abs(right - left);
        var h = Math.abs(top - bottom);
        // Convert to mm with artboard-top-left origin (Y grows downward).
        var ab = doc.artboards[doc.artboards.getActiveArtboardIndex()].artboardRect;
        var x = left - ab[0];
        var y = ab[1] - top;
        return {
            x: round1(x * PT_TO_MM),
            y: round1(y * PT_TO_MM),
            w: round1(w * PT_TO_MM),
            h: round1(h * PT_TO_MM),
            rotation: 0
        };
    }

    function round1(n) { return Math.round(n * 10) / 10; }

    function isoNow() {
        var d = new Date();
        function pad(n) { return n < 10 ? "0" + n : "" + n; }
        return d.getUTCFullYear() + "-" + pad(d.getUTCMonth() + 1) + "-" + pad(d.getUTCDate()) +
               "T" + pad(d.getUTCHours()) + ":" + pad(d.getUTCMinutes()) + ":" + pad(d.getUTCSeconds()) + "Z";
    }

    function toJSON(obj, indent) {
        indent = indent || "";
        var next = indent + "  ";
        var t = typeof obj;
        if (obj === null) return "null";
        if (t === "number" || t === "boolean") return String(obj);
        if (t === "string") return '"' + obj.replace(/\\/g, "\\\\").replace(/"/g, '\\"') + '"';
        if (obj instanceof Array) {
            if (obj.length === 0) return "[]";
            var arr = [];
            for (var i = 0; i < obj.length; i++) arr.push(next + toJSON(obj[i], next));
            return "[\n" + arr.join(",\n") + "\n" + indent + "]";
        }
        var keys = [];
        for (var k in obj) if (obj.hasOwnProperty(k)) keys.push(k);
        if (keys.length === 0) return "{}";
        var parts = [];
        for (var m = 0; m < keys.length; m++) {
            parts.push(next + '"' + keys[m] + '": ' + toJSON(obj[keys[m]], next));
        }
        return "{\n" + parts.join(",\n") + "\n" + indent + "}";
    }
})();
