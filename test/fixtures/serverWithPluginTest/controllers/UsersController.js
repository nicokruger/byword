module.exports = function(db) {
    this.get('/users').findAll(db.users).json('usersFindAll');
    this.get('/users/:users').findById(db.users).json('usersFindById');
};