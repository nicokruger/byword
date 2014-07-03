module.exports = function() {
    this.setBasePath('/products/');

    this.get('/').respond();
    this.get('/apple').respond();
};
