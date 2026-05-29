var corsOk = false;

module.exports = {
  isCorsOk: function () { return corsOk; },
  setCorsFail: function () { corsOk = false; },
};
