module.exports = function() {
    this.setBasePath('/admin');

    this.get().respond();
    this.get('/manage').respond();
};
