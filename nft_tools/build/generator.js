function generate_attributes() {
    return {
        // background
        red: [rand256(), 255],
        green: [rand256(), 255],
        blue: [rand256(), 255],
        // shadows
        shadows: [Array.from({ length: 8 }).reduce((acc) => acc + (Math.random() > 0.75), 0), 8],
        // line-through
        deleted: [Math.random() > 0.9, true],
        // bold
        bold: [Math.random() > 0.9, true],
    };
}

function random_color() {
    return `#${rand256().toString(16).padStart(2, "0")}${rand256().toString(16).padStart(2, "0")}${rand256()
        .toString(16)
        .padStart(2, "0")}`;
}

/**
 * @param {string} raw
 * @param {Record<string, string>} obj
 */
function inject(raw, obj) {
    return raw.replace(/\$(\w+)\$/g, (_, key) => obj[key]);
}

/**
 * @param {number} n
 */
function text_shadow(n) {
    const layers = [];
    for (let i = 0; i < 8; i++) {
        layers.push(
            `${(i % 2 ? 1 : -1) * Math.floor(i / 4 + 1)}px ${
                (i % 2 ? -1 : 1) * Math.floor(i / 4 + 1)
            }px 0px ${random_color()}`,
        );
    }

    return n > 0
        ? `text-shadow: ${layers
              .sort(() => Math.random() > 0.5)
              .slice(0, n)
              .join(", ")};`
        : "";
}

function rand256() {
    return Math.floor(Math.random() * 256);
}

module.exports = { generate_attributes, inject, text_shadow };
