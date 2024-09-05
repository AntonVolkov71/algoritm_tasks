import Queue from "./implementing_queue";


describe("queue", () => {

    let queue

    beforeEach(function () {
        queue = new Queue();
    });

    test('empty queue', () => {
        expect(queue.size()).toBe(0)
    })

    test(' queue', () => {
        queue.enqueue("I'm number one!");
        expect(queue.size()).toBe(1)
    })


    // it("The queue has 'enqueue', 'dequeue', and 'size' method functions.", function() {
    //     test('empty1', ()=>{
    //         expect(q()).toBe(12)
    //     })
    //     // test.expect(queue.size, "'size' is not defined.");
    //     // Test.expect(queue.enqueue, "'enqueue' is not defined.");
    //     // Test.expect(queue.dequeue, "'dequeue' is not defined.");
    // });

    // it("The queue has an initial size of 0.", function() {
    //     Test.assertEquals(queue.size(), 0);
    // });
    //
    // it("Calling 'enqueue' on the queue increases the size by 1.", function() {
    //     queue.enqueue("I'm number one!");
    //     Test.assertEquals(queue.size(), 1);
    // });

});