var corsOk = true;

module.exports = {
  isCorsOk: function () { return corsOk; },
  setCorsFail: function () { corsOk = false; },
};
