module.exports = {
  projects: [
    './web'
  ],
  settings: {
    "coffeesense.ignoredTypescriptErrorCodes": [
      7030, // Not all code paths return a value
      7023, // 'your_var' implicitly has return type 'any' because it does not have a return type annotation and is referenced directly or indirectly in one of its return expressions.
    ],
  }
}