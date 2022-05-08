/**
 * Enqueue item into the queue, observing limit (if provided)
 * @param {Array} queue
 * @param el
 * @param limit
 */
export function enqueue(queue, el, limit = 0) {
	queue.push(el);
	if (limit && queue.length > limit) {
		queue.shift();
	}
}

/**
 * Empty queue using consumer fn, one by one. If consumer returns false, item is re-enqueued.
 * @param {Array} queue
 * @param {Function} consumer
 */
export function flushQueue(queue, consumer) {
	let queueLimit = 0;
	while (queue.length > queueLimit) {
		const msg = queue.shift();
		if (msg) {
			if (consumer(msg) === false) {
				queue.push(msg);
				queueLimit++;
			}
		}
	}
	
	return queueLimit;
}

export function isObject(obj){
	return Object.prototype.toString.call(obj) === '[object Object]';
}

export function isFunction(obj){
	return Object.prototype.toString.call(obj) === '[object Function]';
}
