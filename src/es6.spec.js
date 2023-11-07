const assert = require('assert');
const core = require('./es6');

describe('es6', () => {
    describe('#fioToName', () => {
        it('пустая строка никак не преобразуется', () => {
            assert.strictEqual(core.fioToName(''), '');
        });

        it('строка с одним значением (без пробелов) никак не преобразуется', () => {
            assert.strictEqual(core.fioToName('Иван'), 'Иван');
        });
        
        it('ФИО в Имя Фамилия корректно', () => {
            assert.strictEqual(core.fioToName('Иванов Иван Иванович'), 'Иван Иванов');
        });

        it('ФИ в Имя Фамилия', () => {
            assert.strictEqual(core.fioToName('Петров Петр'), 'Петр Петров');
        });
    });

    describe('#filterUnique', () => {
        it('массив с уникальными равен сам себе', () => {
            assert.deepStrictEqual(core.filterUnique([1, 2, 3]), [1, 2, 3]);
        });

        it('массив с неуникальными отфильтрован', () => {
            assert.deepStrictEqual(core.filterUnique([1, 1, 1, 1]), [1]);
        });

        it('пустой массив', () => {
            assert.deepStrictEqual(core.filterUnique([]), []);
        });

        it('сохраняется порядок уникальных элементов', () => {
            assert.deepStrictEqual(core.filterUnique([9, 4, 9, 4, 8, 4, 6, 11, 20]), [9, 4, 8, 6, 11, 20]);
        });
    });

    describe('#calculateSalaryDifference', () => {
        it('считает разницу корректно', () => {
            assert.strictEqual(core.calculateSalaryDifference([1, 2, 3]), 3);
        });

        it('на пустой массив возвращается false значение', () => {
            assert.strictEqual(!!core.calculateSalaryDifference([]), false);
        });
    });

    describe('#Dictionary', () => {
        it('экземпляр класса создается', () => {
            const dict = new core.Dictionary();

            assert.strictEqual(!!dict, true);
        });

        it('можно создать словарь из объекта', () => {
            const dict = new core.Dictionary({a: 1, b: 2});

            assert.strictEqual(!!dict, true);
        });

        it('можно проверить, какое количество пар ключ-значение хранится в словаре', () => {
            const dict = new core.Dictionary({a: 'letter', '1': 'figure'});

            assert.strictEqual('length' in dict, true);
            assert.strictEqual(dict.length, 2);
        });

        it('корректно добавляются элементы', () => {
            const dict = new core.Dictionary();
            dict.add('a', 'letter');
            dict.add('1', 'figure');
            
            assert.strictEqual(dict.get('a'), 'letter');
            assert.strictEqual(dict.get('1'), 'figure');
        });

        it('можно добавлять только строки', () => {
            const dict = new core.Dictionary();
            dict.add('1', 1);
            dict.add('2', 2.4);
            dict.add('3', true);
            dict.add('4', null);
            dict.add('5', undefined);
            dict.add('6', {});

            assert.strictEqual(dict.get('1'), undefined);
            assert.strictEqual(dict.get('2'), undefined);
            assert.strictEqual(dict.get('3'), undefined);
            assert.strictEqual(dict.get('4'), undefined);
            assert.strictEqual(dict.get('5'), undefined);
            assert.strictEqual(dict.get('6'), undefined);
        });

        it('корректно удаляются элементы', () => {
            const dict = new core.Dictionary();
            dict.add('a', 'letter');
            dict.add('1', 'figure');
            dict.remove('a');
            
            assert.strictEqual(dict.get('a'), undefined);
            assert.strictEqual(dict.length, 1);
        });
    });
});