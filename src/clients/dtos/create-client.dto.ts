import { Type } from "class-transformer";
import {
	IsDate,
	IsEmail,
	IsNotEmpty,
	IsString,
	Matches,
} from "class-validator";

export class CreateClientDto {
	@IsNotEmpty()
	@IsString()
	name: string;

	@IsNotEmpty()
	@IsString()
	@Matches(/^\d{3}(\.\d{3}){2}-\d{2}$|^\d{11}$/, {
		message: "CPF must be 11 digits",
	})
	cpf: string;

	@IsNotEmpty()
	@IsDate()
	@Type(() => Date)
	birthDate: Date;

	@IsNotEmpty()
	@IsEmail()
	email: string;

	@IsNotEmpty()
	@Matches(/^\(\d{2}\)\s?\d{5}-\d{4}$/, {
		message: "Phone must be in format: (11) 12345-6789",
	})
	phone: string;
}
