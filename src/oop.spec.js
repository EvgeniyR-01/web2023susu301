const assert = require('assert');
const core = require('./oop');
const {Point3D} = require("./oop");

describe('ООП', () => {
    describe('#Point', () => {
        it('Точка создается с двумя параметрами, которые становятся x и y', () => {
            const point = new core.Point(1, 2);

            assert.strictEqual(point.x, 1);
            assert.strictEqual(point.y, 2);
        });

        it('Точка создается без параметров, x и y принимают нули как значение по умолчанию', () => {
            const point = new core.Point();

            assert.strictEqual(point.x, 0);
            assert.strictEqual(point.y, 0);
        });

        it('Точка создается с одним параметром, x принимает значение, y принимают нуль как значение по умолчанию', () => {
            const point = new core.Point(1);

            assert.strictEqual(point.x, 1);
            assert.strictEqual(point.y, 0);
        });

        it('Корректно работает вычисление расстояния от точки Point до начала координат', () => {
            const point = new core.Point(3, 4);

            let distance = 5;
            assert.strictEqual(point.calculateDistanceFromStartingPoint(), distance);
        });
    });

    describe('#Point3D', () => {
        it('Точка создается с двумя параметрами, которые становятся x и y, z принимает нуль как значение по умолчанию', () => {
            const point = new core.Point3D(1, 2);

            assert.strictEqual(point.x, 1);
            assert.strictEqual(point.y, 2);
            assert.strictEqual(point.z, 0);
        });

        it('Точка создается с тремя параметрами, которые становятся x, y, z', () => {
            const point = new core.Point3D(1, 2.5, -3);

            assert.strictEqual(point.x, 1);
            assert.strictEqual(point.y, 2.5);
            assert.strictEqual(point.z, -3);
        });

        it('Корректно работает расчёт расстояния от точки Point3D до начала координат', () => {
            const point = new core.Point3D(3, 4, 5);
            let distance = Math.sqrt(point.x*point.x + point.y*point.y + point.z*point.z);

            assert.strictEqual(point.calculateDistanceFromStartingPoint(), distance);
        });

        it('Point3D имеет статический метод vectorLength', () => {
            const pointA = new core.Point3D(1, 2, -3);
            const pointB = new core.Point3D(1, -1, 1);

            assert.strictEqual(typeof Point3D.vectorLength, 'function');

            const length = Point3D.vectorLength(pointA, pointB);

            assert.strictEqual(length, 5);
        });
    });

    describe('#Queue', () => {
        it('может создаться', () => {
            const queue = new core.Queue();

            assert.strictEqual(!!queue, true);
        });

        it('есть возможность проверить длину очереди', () => {
            const queue = new core.Queue();

            assert.strictEqual('length' in queue, true);
        });

        it('может создаться пустой', () => {
            const queue = new core.Queue();

            assert.strictEqual(queue.length, 0);
        });

        it('проверка массивом', () => {
            const queue = new core.Queue([]);
            
            assert.strictEqual(!!queue, true);
            assert.strictEqual(queue?.length, 0);
        });

        it('проверка на пограничные случаи', () => {
            const queue1 = new core.Queue([1]);
            const queue2 = new core.Queue([1, 2]);
            
            assert.strictEqual(!!queue1, true);
            assert.strictEqual(queue1?.length, 1);
            assert.strictEqual(!!queue2, true);
            assert.strictEqual(queue2?.length, 2);
        });

        it('корректно создаётся из массива (значения верно копируются)', () => {
            let array = [1,2,3,5];
            const queue = new core.Queue(array);

            queueArray = queue.toArray();
            for (let i = 0; i < array.length; i++) {
                assert.deepStrictEqual(array[i], queueArray[i]);
            }
        });

        it('может быть создан из объекта', () => {
            arrayObj = {
                "1": 1,
                "2": 5,
                "3": 7,
                "a": 9,
            }

            const queue = new core.Queue(arrayObj);
            for (let key in arrayObj) {
                assert.deepStrictEqual(arrayObj[key], queue.dequeue());
            }
        });

        it('корректно добавляются элементы', () => {
            const queue = new core.Queue();
            queue.enqueue(1);
            queue.enqueue(2);

            assert.strictEqual(queue.length, 2);
        })

        it('корректно удаляются элементы', () => {
            const queue = new core.Queue();
            queue.enqueue(2);
            queue.enqueue(3);

            assert.strictEqual(queue.dequeue(), 2);
            assert.strictEqual(queue.length, 1);
        })
    });
});
