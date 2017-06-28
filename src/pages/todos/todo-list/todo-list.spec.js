//@ts-nocheck
// import 'mocha';
// import TodoList from './todo-list.component';
// import Category from '../../../app/classes/category';

describe('TodoList', function() {
	before(function() {
		//var testCat = new Category('Tasks', 0, new Date(), 13, 1);
		var testTodo = new Todo('Take out trash', undefined, new Date(), 
			false, undefined, false, Priority.Low, 2);
	})
	describe('#activateSelect()', function() {
		it('should make selectActive true', function() {
			TodoList.activateSelect(testTodo);
			assert(TodoList.isSelectActive == true, 'test fail');
		});
	});
});

