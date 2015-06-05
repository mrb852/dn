var Measure = module.exports = function() {
  this.elapsed = null;
  this._start = 0;

  this.begin = function() {
    this._start = process.hrtime();
  }

  this.end = function() {
    var precision = 3;
    var elapsed = process.hrtime(this._start)[1] / 1000000;
    this.elapsed = {
      seconds: process.hrtime(this._start)[0],
      ms: elapsed.toFixed(precision)
    }
  }
}
