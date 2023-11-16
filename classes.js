class Exercise {
	constructor(name) {
		this.name = name;
		this.tests = new Array(50);
	}
};

a = new Exercise("test");
console.log(a.tests);