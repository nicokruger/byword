module.exports = function() {
    this.get('/respond').respond();

    this.get('/redirect').redirect('/somewhere-over-the-rainbow');
    this.get('/somewhere-over-the-rainbow').respond();

    this.get('/render').attr('title', 'welcome').render('index');

    this.get('/json').attr('key1', 'val1').attr({
        key2: 'val2',
        key3: 'val3'
    }).json();
};
