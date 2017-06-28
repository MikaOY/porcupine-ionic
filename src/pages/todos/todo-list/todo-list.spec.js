var todolist = require('./todo-list.component.ts');

describe('TodoList', function() {
	before(function() {
		var testCat = new Category('Tasks', 0, new Date(), 13, 1);
		var testTodo = new Todo('Take out trash', testCat, new Date(), 
			false, undefined, false, Priority.Low, 2);
	})
	describe('#activateSelect()', function() {
		it('should make selectActive true', function() {
			todolist.activateSelect(testTodo);
			assert(todolist.isSelectActive == true, 'test fail');
		})
	});
});
