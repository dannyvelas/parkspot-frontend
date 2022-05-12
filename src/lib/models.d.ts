export type Admin = {
	id: string;
	firstName: string;
	lastName: string;
	email: string;
	isPrivileged: boolean;
};

export type Permit = {
	id: number;
	residentId: string;
	car: Car;
	startDate: string;
	endDate: string;
	requestTS: number;
	affectsDays: boolean;
	exceptionReason: string;
};

export type Car = {
	id: string;
	licensePlate: string;
	color: string;
	make: string;
	model: string;
	amtParkingDaysUsed: number;
};

export type Resident = {
	id: string;
	firstName: string;
	lastName: string;
	phone: string;
	email: string;
	unlimDays: boolean;
	amtParkingDaysUsed: number;
};
