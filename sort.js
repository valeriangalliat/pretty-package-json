function sortObject (sortedKeys, object) {
  const newObject = {}

  for (const key of sortedKeys) {
    if (key in object) {
      newObject[key] = object[key]
    }
  }

  // Append unknown keys at the end.
  for (const key of Object.keys(object)) {
    if (!(key in newObject)) {
      newObject[key] = object[key]
    }
  }

  return newObject
}

function alphabeticalSortObject (object) {
  return Object.fromEntries(Object.entries(object).sort(([a], [b]) => a.localeCompare(b)))
}

module.exports = {
  sortObject,
  alphabeticalSortObject
}
