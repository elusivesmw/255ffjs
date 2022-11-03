/**
 * Inserts string at index
 * @param {*} index The index to insert a string
 * @param {*} string The string to insert
 * @returns The modified string
 */
String.prototype.insert = function (index, string) {
    if (index > 0) {
        return this.substring(0, index) + string + this.substring(index);
    }
    return string + this;
}

/**
 * Replaces string in selected range
 * @param {*} startIndex The start index
 * @param {*} endIndex The end index
 * @param {*} string The string to place between the start and end indices
 * @returns The modified string
 */
String.prototype.insertSelection = function (startIndex, endIndex, string) {
    return this.substring(0, startIndex) + string + this.substring(endIndex);
}